import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import * as chatApi from '@/api/chat'

interface StockLike {
  code: string
  name: string
  exchange: string
  currentPrice: number
  change: number
  changePercent: number
}

type Props = {
  selectedStockCode?: string | null
  onSelectStock?: (stock: StockLike) => void
}

export default function LeftSidebar({ selectedStockCode, onSelectStock }: Props) {
  const [chats, setChats] = useState<chatApi.BackendChat[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const fetchChats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await chatApi.listChats()
      setChats(data)
    } catch (err: any) {
      console.error(err)
      setError('채팅방 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  const visibleChats = useMemo(
    () =>
      chats.filter((chat) => chat.trash_can !== 'in' && chat.stock_code),
    [chats],
  )

  const handleSelectChat = (chat: chatApi.BackendChat) => {
    if (!chat.stock_code) {
      return
    }
    onSelectStock?.({
      code: chat.stock_code,
      name: chat.title || chat.stock_code,
      exchange: '',
      currentPrice: 0,
      change: 0,
      changePercent: 0,
    })
  }

  const handleNewChat = async () => {
    const code = window.prompt('새로 대화를 시작할 종목 코드를 입력하세요.')
    if (!code) {
      return
    }
    const normalized = code.trim().toUpperCase()
    if (!normalized) return
    try {
      setCreating(true)
      const resp = await chatApi.upsertRoomByStock(normalized, normalized)
      await fetchChats()
      onSelectStock?.({
        code: resp.stock_code,
        name: resp.title,
        exchange: '',
        currentPrice: 0,
        change: 0,
        changePercent: 0,
      })
    } catch (err: any) {
      console.error(err)
      const message =
        err?.status === 400
          ? '유효한 종목 코드를 입력해주세요.'
          : '새 채팅방을 만들지 못했습니다.'
      setError(message)
      alert(message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Sidebar>
      <NewChatButton onClick={handleNewChat} disabled={creating}>
        {creating ? '생성 중...' : '+ 새 채팅'}
      </NewChatButton>
      {loading && <Placeholder>채팅방을 불러오는 중...</Placeholder>}
      {error && <ErrorBanner role="alert">{error}</ErrorBanner>}
      {!loading && visibleChats.length === 0 && (
        <Placeholder>진행 중인 채팅이 없습니다.</Placeholder>
      )}
      {visibleChats.map((chat) => (
        <ChatCard
          key={chat.chat_id}
          onClick={() => handleSelectChat(chat)}
          data-selected={
            chat.stock_code &&
            chat.stock_code.toUpperCase() === selectedStockCode?.toUpperCase()
          }
        >
          <ChatTitle>{chat.title || chat.stock_code}</ChatTitle>
          <ChatMeta>{chat.stock_code}</ChatMeta>
        </ChatCard>
      ))}
    </Sidebar>
  )
}

const Sidebar = styled.aside`
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e5e5e5;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d9d9e3;
    border-radius: 3px;
  }
`;

const NewChatButton = styled.button`
  background: #4169e1;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  font-family: inherit;

  &:hover {
    background: #3558b8;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(65, 105, 225, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ChatCard = styled.button`
  background: #f7f7f8;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ebebeb;
    border-color: #d0d0d0;
    transform: translateX(2px);
  }
  &[data-selected='true'] {
    border-color: #4169e1;
    background: #eaf0ff;
  }
`;

const Placeholder = styled.div`
  padding: 16px;
  font-size: 13px;
  color: #8e8ea0;
  text-align: center;
`;

const ErrorBanner = styled.div`
  padding: 12px 14px;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  font-size: 13px;
`;

const ChatMeta = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #8e8ea0;
`;

const ChatTitle = styled.p`
  margin: 0 0 8px;
  font-size: 13px;
  color: #202123;
  line-height: 1.4;
  font-weight: 500;
`;
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import type { ChatMessage } from '@/types/chat'
import MessageItem from '@/components/chat/MessageItem'
import ChatInput from '@/components/chat/ChatInput'
import * as chatApi from '@/api/chat'

type Props = {
  stockCode?: string | null
}

export default function ChatArea({ stockCode }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [roomId, setRoomId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState('')

  const canChat = useMemo(() => Boolean(stockCode), [stockCode])

  useEffect(() => {
    let cancelled = false
    async function ensureRoomAndLoad() {
      setLoading(true)
      setError(null)
      setMessages([])
      setRoomId(null)
      try {
        if (!stockCode) {
          return
        }
        // 1) Try to find existing room for stock
        let room = await chatApi.getRoomByStock(stockCode)
        // 2) If not found, create it
        if (!room?.chat_id) {
          room = await chatApi.createRoom({ title: stockCode, stock_code: stockCode })
        }
        if (cancelled) return
        setRoomId(room.chat_id)
        // 3) Load messages
        const msgs = await chatApi.getMessages(room.chat_id)
        if (cancelled) return
        setMessages(
          msgs.map((m) => ({
            id: String(m.messages_id),
            role: m.role === 'assistant' ? 'bot' : 'user',
            text: m.content,
          })),
        )
      } catch (e: any) {
        // If 404 on getRoomByStock, create it
        if (e?.status === 404 && stockCode) {
          try {
            const room = await chatApi.createRoom({ title: stockCode, stock_code: stockCode })
            if (cancelled) return
            setRoomId(room.chat_id)
            setMessages([])
          } catch (e2: any) {
            if (cancelled) return
            setError('채팅방 생성 실패')
          }
        } else {
          if (cancelled) return
          setError('채팅 데이터를 불러오지 못했습니다.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    ensureRoomAndLoad()
    return () => {
      cancelled = true
    }
  }, [stockCode])

  const send = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    if (!roomId) {
      setError('먼저 종목을 선택해 채팅방을 생성하세요.')
      return
    }
    // Optimistic update
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text: trimmed },
    ])
    setInput('')
    ;(async () => {
      try {
        await chatApi.postMessage(roomId, trimmed)
        // Optionally refresh from server to align roles/order
        const msgs = await chatApi.getMessages(roomId)
        setMessages(
          msgs.map((m) => ({
            id: String(m.messages_id),
            role: m.role === 'assistant' ? 'bot' : 'user',
            text: m.content,
          })),
        )
      } catch {
        setError('메시지 전송 실패')
      }
    })()
  }

  return (
    <Container>
      <MessagesArea>
        {!canChat && (
          <WelcomeMessage>
            <WelcomeIcon>💼</WelcomeIcon>
            <WelcomeTitle>Alpha Bot에 오신 것을 환영합니다</WelcomeTitle>
            <WelcomeDescription>
              상단의 검색창에서 종목을 선택하면 해당 종목에 대한 대화를 시작할 수 있습니다.
            </WelcomeDescription>
          </WelcomeMessage>
        )}
        {error && (
          <ErrorMessage role="alert">
            ⚠️ {error}
          </ErrorMessage>
        )}
        {loading && (
          <LoadingMessage role="status" aria-live="polite">
            <Spinner />
            불러오는 중...
          </LoadingMessage>
        )}
        {canChat && !loading && messages.length === 0 && (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>아직 메시지가 없습니다. 첫 메시지를 보내보세요!</EmptyText>
          </EmptyState>
        )}
        {messages.map((m) => (
          <MessageItem key={m.id} message={m} />
        ))}
      </MessagesArea>
      <InputWrapper>
        <ChatInput value={input} onChange={setInput} onSubmit={send} disabled={!canChat} />
      </InputWrapper>
    </Container>
  )
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #ffffff;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

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

  &::-webkit-scrollbar-thumb:hover {
    background: #c5c5d2;
  }
`;

const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  margin-top: 80px;
`;

const WelcomeIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const WelcomeTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #202123;
  margin: 0 0 16px 0;
`;

const WelcomeDescription = styled.p`
  font-size: 16px;
  color: #565869;
  line-height: 1.6;
  max-width: 500px;
  margin: 0;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #c33;
  font-size: 14px;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  padding: 24px;
  color: #8e8ea0;
  font-size: 14px;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e5e5e5;
  border-top-color: #4169e1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  margin-top: 60px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #8e8ea0;
  margin: 0;
`;

const InputWrapper = styled.div`
  padding: 20px;
  background: #ffffff;
  border-top: 1px solid #e5e5e5;
`;
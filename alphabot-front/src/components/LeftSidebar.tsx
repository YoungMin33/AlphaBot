import styled from 'styled-components';

// Mock data for chat history
const chatHistory = [
  {
    id: 1,
    title: '📄 MSFT 관련된 내용 질문하고 싶은데...',
    date: '2024.9.11'
  },
  {
    id: 2,
    title: '📊 AAPL 주식 분석 부탁드립니다',
    date: '2024.9.10'
  },
  {
    id: 3,
    title: '💹 테슬라 투자 전략',
    date: '2024.9.9'
  },
]

export default function LeftSidebar() {
  const handleNewChat = () => {
    console.log('새 채팅 시작')
  }

  return (
    <Sidebar>
      <NewChatButton onClick={handleNewChat}>
        + 새 채팅
      </NewChatButton>
      
      {chatHistory.map((chat) => (
        <ChatCard key={chat.id}>
          <ChatTitle>{chat.title}</ChatTitle>
          <ChatDate>{chat.date}</ChatDate>
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

const ChatCard = styled.div`
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
`;

const ChatTitle = styled.p`
  margin: 0 0 8px;
  font-size: 13px;
  color: #202123;
  line-height: 1.4;
  font-weight: 500;
`;

const ChatDate = styled.p`
  margin: 0;
  font-size: 11px;
  color: #8e8ea0;
`;

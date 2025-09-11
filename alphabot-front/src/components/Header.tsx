export default function Header() {
  return (
    <header className="header">
      <div className="container header-row">
        <button className="new-chat-btn" aria-label="새 채팅 시작">
          + 새 채팅
        </button>
        <div className="title">
          <span className="bot-icon" aria-hidden>
            🤖
          </span>
          <span className="app-name">Alpha Bot</span>
        </div>
      </div>
    </header>
  )
}


import './App.css'
import Header from '@/components/Header'
import LeftSidebar from '@/components/LeftSidebar'
import RightMenu from '@/components/RightMenu'
import ChatArea from '@/components/ChatArea'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <LeftSidebar />
        <ChatArea />
        <RightMenu />
      </main>
    </div>
  )
}

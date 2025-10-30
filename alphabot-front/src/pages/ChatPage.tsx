// 기존에 app.tsx에 있던 내용을 아예 페이지 컴포넌트로 만듬. 로그인페이지와 웰컴페이지 라우팅을 위해서.

import React from 'react';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightMenu from '../components/RightMenu';
import ChatArea from '../components/ChatArea';


const MainPage: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <LeftSidebar />
        <ChatArea />
        <RightMenu />
      </main>
    </div>
  );
};

export default MainPage;
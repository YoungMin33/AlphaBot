
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

//모든 페이지 컴포넌트들 가져오기
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/chat" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
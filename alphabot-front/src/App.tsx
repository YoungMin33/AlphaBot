import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import MyPage from './pages/MyPage';
import BookmarkPage from './pages/BookmarkPage';
import TrashPage from './pages/TrashPage';
import LoginScreen from './pages/LoginScreen'; 
import { CategoryAdminPage } from './pages/CategoryAdminPage'; 

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          
          <Route path="/admin/categories" element={<CategoryAdminPage />} />
          
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/bookmarks" element={<BookmarkPage />} />
          <Route path="/trash" element={<TrashPage />} />
          <Route path="/login-screen" element={<LoginScreen />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
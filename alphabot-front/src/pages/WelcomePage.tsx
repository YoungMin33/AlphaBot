
import React from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 가져오기

const WelcomePage: React.FC = () => {
  return (
    <div className="login-container">
      <h1>Alphabot에 오신 것을 환영합니다!</h1>
      {/* Link 컴포넌트를 사용해서 페이지 새로고침 없이 /login 로 이동함 */}
      <Link to="/login">
        <button>로그인</button>
      </Link>
      <br />
      <br />
      <Link to="/signup">
        <button>회원가입</button>
      </Link>
    </div>
  );
};

export default WelcomePage;

import React from 'react';

//버튼 props 타입 정의
interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode; //버튼 내부에 들어갈 텍스트나 다른 요소들
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ onClick, children, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ padding: '8px 16px', margin: '8px 0', width: '268px', cursor: 'pointer' }}
    >
      {children}
    </button>
  );
};

export default Button;

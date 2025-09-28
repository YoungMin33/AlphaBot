
import React from 'react';

// 컴포넌트가 받을 props의 타입을 정의
interface InputProps {
  type: string;
  value: string;
  placeholder?: string; //선택적 prop
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type, value, placeholder, onChange }) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      style={{ padding: '8px', margin: '4px 0', width: '250px' }}
    />
  );
};

export default Input;
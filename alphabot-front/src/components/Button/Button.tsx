// src/components/Button/Button.tsx

import React, { type FC, type ButtonHTMLAttributes } from 'react';
import { StyledButton } from './ButtonStyle.ts';

// 버튼이 받을 속성(props)의 타입을 정의합니다.
// ButtonHTMLAttributes<HTMLButtonElement>를 확장하여 HTML <button> 태그의 모든 속성을 사용할 수 있게 합니다.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'; // 버튼 스타일 종류
  size?: 'small' | 'medium' | 'large'; // 버튼 크기
}

const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  ...props
}) => {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
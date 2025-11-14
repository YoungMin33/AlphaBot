/**
 * @file src/components/Button/Button.tsx
 * @description ButtonStyle.ts에서 정의한 스타일을 적용하는 공통 버튼 컴포넌트입니다.
 * styled-components의 'as' prop과 모든 HTML <button> 속성을 지원하도록 확장되었습니다.
 */

import React from 'react';
// ButtonStyle.ts에서 styled-component인 StyledButton을 가져옵니다.
import { StyledButton } from './ButtonStyle';

// ButtonStyle.ts에 정의된 StyledButtonProps 타입 가져오기 (variant, size)
// ButtonStyle.ts에서 StyledButtonProps가 export되어 있어야 합니다.
// 만약 export되어 있지 않다면, ButtonStyle.ts에서 export 해주세요.
// (예: export interface StyledButtonProps { ... })
// 여기서는 ButtonStyle.ts의 타입을 직접 사용하지 않고, ButtonProps에 정의합니다.

/**
 * @interface ButtonProps
 * @description 공통 버튼 컴포넌트가 받을 props 타입 정의
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼의 디자인 (primary, secondary, ghost) */
  variant: 'primary' | 'secondary' | 'ghost';
  
  /** 버튼의 크기 (small, medium, large) */
  size: 'small' | 'medium' | 'large';
  
  /** 버튼 내부에 표시될 내용 */
  children: React.ReactNode;
  
  /** * [핵심 수정] styled-components의 다형성을 위한 'as' prop.
   * 예: as={Link}
   */
  as?: React.ElementType; 
  
  /**
   * @type {string}
   * @description
   * [신규 추가] 'as={Link}'와 함께 사용될 때 react-router-dom의 'to' prop을
   * 전달받기 위해 추가합니다.
   */
  to?: string;
}

/**
 * @component Button
 * @description
 * ButtonStyle.ts에 정의된 스타일을 사용하는 재사용 가능한 버튼 컴포넌트입니다.
 * 'as' prop을 지원하여 <Link> 등 다른 HTML 태그나 컴포넌트로 렌더링할 수 있습니다.
 */
const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', // 기본값
  size = 'medium',   // 기본값
  as,
  ...rest // 👈 onClick, type, disabled, 'to' 등 나머지 모든 HTML 속성
}) => {
  return (
    <StyledButton 
      variant={variant} 
      size={size} 
      as={as} 
      {...rest} // 👈 'to' prop이 여기를 통해 StyledButton으로 전달됩니다.
    >
      {children}
    </StyledButton>
  );
};

export default Button;
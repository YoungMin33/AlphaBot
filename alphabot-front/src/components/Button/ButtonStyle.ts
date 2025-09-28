// src/components/Button/ButtonStyle.ts

import styled from 'styled-components';

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'small' | 'medium' | 'large';
}

export const StyledButton = styled.button<StyledButtonProps>`
  // 모든 버튼에 공통으로 적용되는 기본 스타일
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* 아이콘과 텍스트 사이 간격 */

  // variant prop에 따라 스타일을 조건부로 적용
  ${(props) => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #007bff;
          color: white;
          &:hover {
            background-color: #0056b3;
          }
        `;
      case 'secondary':
        return `
          background-color: #6c757d;
          color: white;
          &:hover {
            background-color: #5a6268;
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: #007bff;
          border: 1px solid #007bff;
          &:hover {
            background-color: #e9ecef;
          }
        `;
      default:
        return '';
    }
  }}

  // size prop에 따라 스타일을 조건부로 적용
  ${(props) => {
    switch (props.size) {
      case 'small':
        return `
          padding: 8px 12px;
          font-size: 14px;
        `;
      case 'medium':
        return `
          padding: 12px 18px;
          font-size: 16px;
        `;
      case 'large':
        return `
          padding: 16px 24px;
          font-size: 18px;
        `;
      default:
        return '';
    }
  }}
`;
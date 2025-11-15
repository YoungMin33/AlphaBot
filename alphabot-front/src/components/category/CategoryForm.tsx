import React, { useState, useEffect } from 'react';
import { useCategoryMutations } from '@/hooks/useCategoryMutations';
import type { Category, CategoryCreateUpdateDTO } from './category.types';
import { AxiosError } from 'axios';
import styled from 'styled-components';
import Button from '@/components/Button/Button';

// --- Styled Components ---

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검은 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormContainer = styled.form`
  width: 100%;
  max-width: 450px; /* 폼 너비 */
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0;
    color: #333;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; 
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

// --- Component ---

interface Props {
  categoryToEdit: Category | null;
  onClose: () => void;
}

export const CategoryForm: React.FC<Props> = ({ categoryToEdit, onClose }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { createMutation, updateMutation } = useCategoryMutations();
  const isEditing = !!categoryToEdit;
  const mutation = isEditing ? updateMutation : createMutation;

  useEffect(() => {
    if (isEditing) setTitle(categoryToEdit.title);
  }, [categoryToEdit, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const data: CategoryCreateUpdateDTO = { title };

    try {
      if (isEditing && categoryToEdit) {
        await updateMutation.mutateAsync({ categoryId: categoryToEdit.category_id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onClose(); // 성공 시 모달 닫기
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 400) {
        setError('제목이 중복되거나 유효하지 않습니다.');
      } else {
        setError('작업에 실패했습니다. (403: 권한 부족 / 500: 서버 오류)');
      }
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <FormContainer onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <h3>{isEditing ? '카테고리 수정' : '새 카테고리 생성'}</h3>
        
        <StyledInput
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="카테고리 제목"
          required
          autoFocus
        />

        {error && <p style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>{error}</p>}

        <ButtonContainer>
          <Button
            type="button"
            variant="ghost" 
            size="small"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="small"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? '저장 중...' : '저장'}
          </Button>
        </ButtonContainer>
      </FormContainer>
    </ModalOverlay>
  );
};
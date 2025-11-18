import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory, updateCategory, deleteCategory } from '@/api/categoryClient';
import { CATEGORY_QUERY_KEYS } from './useCategories';
// 👇 [수정] import 경로가 hooks/useCategoryMutations.ts의 위치 기준이어야 합니다.
import type { CategoryCreateUpdateDTO } from '@/components/category/category.types'; 

/**
 * 카테고리 CUD(생성, 수정, 삭제)를 위한 훅
 */
export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  // 모든 카테고리 목록 캐시(페이지네이션 포함)를 무효화하는 함수
  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() });
  };

  // 생성 (POST)
  const createMutation = useMutation({
    mutationFn: (data: CategoryCreateUpdateDTO) => createCategory(data),
    onSuccess: invalidateLists, // 성공 시 목록 캐시 무효화
  });

  // 수정 (PUT)
  // 👇 [핵심 수정] 여기서 받는 객체의 속성 이름이 'id'인지 확인합니다.
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryCreateUpdateDTO }) =>
      updateCategory(id, data), // 👈 API 클라이언트에도 'id'로 전달
    onSuccess: invalidateLists, // 성공 시 목록 캐시 무효화
  });

  // 삭제 (DELETE)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: invalidateLists, // 성공 시 목록 캐시 무효화
  });

  return { createMutation, updateMutation, deleteMutation };
};
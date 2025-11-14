import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory, updateCategory, deleteCategory } from '@/api/categoryClient';
import { CATEGORY_QUERY_KEYS } from './useCategories';
import type { CategoryCreateUpdateDTO } from '@/components/category/category.types';

/**
 * 카테고리 CUD(생성, 수정, 삭제)를 위한 훅
 */
export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  // 모든 카테고리 목록 캐시(페이지네이션 포함)를 무효화하는 함수
  const invalidateLists = () => {
    // CATEGORY_QUERY_KEYS.lists()는 ['categories', 'list']를 반환합니다.
    // 이 키로 시작하는 모든 쿼리를 무효화합니다.
    queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() });
  };

  // 생성 (POST)
  // V4/V5: useMutation은 옵션 객체를 받습니다.
  const createMutation = useMutation({
    mutationFn: (data: CategoryCreateUpdateDTO) => createCategory(data),
    onSuccess: invalidateLists, // 성공 시 목록 캐시 무효화
  });

  // 수정 (PUT)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryCreateUpdateDTO }) =>
      updateCategory(id, data),
    onSuccess: invalidateLists, // 성공 시 목록 캐시 무효화
  });

  // 삭제 (DELETE)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: invalidateLists, // 성공 시 목록 캐시 무효화
  });

  return { createMutation, updateMutation, deleteMutation };
};
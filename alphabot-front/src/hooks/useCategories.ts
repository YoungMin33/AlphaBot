import { useQuery, keepPreviousData } from '@tanstack/react-query'; // 👈 keepPreviousData를 import
import { listCategories } from '@/api/categoryClient';
import type { CategoryQuery } from '@/components/category/category.types';

// 쿼리 키
export const CATEGORY_QUERY_KEYS = {
  all: ['categories'] as const,
  lists: () => [...CATEGORY_QUERY_KEYS.all, 'list'] as const,
  list: (query: CategoryQuery) => [...CATEGORY_QUERY_KEYS.lists(), query] as const,
};

/**
 * 카테고리 목록/검색/페이지네이션을 위한 쿼리 훅
 */
export const useCategories = (query: CategoryQuery) => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.list(query),
    queryFn: () => listCategories(query),
    
    // 👇 [수정됨] v3의 'keepPreviousData: true'는 v4/v5에서
    // 'placeholderData: keepPreviousData'로 변경되었습니다.
    placeholderData: keepPreviousData,
  });
};
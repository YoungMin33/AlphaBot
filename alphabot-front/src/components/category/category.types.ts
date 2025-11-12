// src/features/category/category.types.ts

/**
 * (GET) /api/categories/{id} 응답
 * (POST, PUT) /api/categories 응답
 */
export interface Category {
  id: number;
  title: string;
  item_count: number;
  created_at: string;
}

/**
 * (GET) /api/categories 응답 (목록)
 */
export interface CategoryList {
  items: Category[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * (POST, PUT) /api/categories 요청 본문 (DTO)
 */
export interface CategoryCreateUpdateDTO {
  title: string;
}

/**
 * (GET) /api/categories 쿼리 파라미터
 */
export interface CategoryQuery {
  page: number;
  page_size: number;
  search?: string;
}
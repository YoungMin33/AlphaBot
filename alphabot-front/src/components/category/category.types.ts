// src/features/category/category.types.ts

export interface Category {
  category_id: number;
  user_id: number;
  title: string;
  created_at: string;
}

export interface CategoryList {
  categories: Category[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
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
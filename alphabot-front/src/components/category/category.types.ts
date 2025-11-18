/**
 * @file src/components/category/category.types.ts
 * @description 카테고리 기능 관련 모든 타입 정의
 */

/**
 * (GET) /api/categories/{id} 응답
 * (POST, PUT) /api/categories 응답
 */
export interface Category {
  id: number;
  title: string;
  item_count: number;  // 👈 이슈의 UI 구현에 필요
  created_at: string;
  color?: string;       // 👈 BookmarkPage에서 UI용으로 사용
}

/**
 * (GET) /api/categories 응답 (목록)
 * [수정] 'items' 속성을 명시적으로 포함합니다.
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
 * (useCategories 훅에서 이 타입을 사용합니다)
 */
export interface CategoryQuery {
  page: number;
  page_size: number;
  search?: string;
}
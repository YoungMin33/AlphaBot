import { apiClient } from '@/lib/apiClient';
import type {
  Category,
  CategoryList,
  CategoryCreateUpdateDTO,
  CategoryQuery,
} from '@/components/category/category.types';

const API_BASE_URL = '/api/categories';

// 1. 목록/검색/페이지네이션 (GET)
export const listCategories = async (query: CategoryQuery): Promise<CategoryList> => {
  const params = new URLSearchParams({
    page: String(query.page),
    page_size: String(query.page_size),
    search: query.search || '',
  });
  
  const response = await apiClient.get<CategoryList>(`${API_BASE_URL}?${params}`);
  return response.data;
};

// 2. 단일 조회 (GET BY ID)
export const getCategory = async (id: number): Promise<Category> => {
  const response = await apiClient.get<Category>(`${API_BASE_URL}/${id}`);
  return response.data;
};

// 3. 생성 (POST)
export const createCategory = async (data: CategoryCreateUpdateDTO): Promise<Category> => {
  const response = await apiClient.post<Category>(API_BASE_URL, data);
  return response.data;
};

// 4. 수정 (PUT)
export const updateCategory = async (id: number, data: CategoryCreateUpdateDTO): Promise<Category> => {
  const response = await apiClient.put<Category>(`${API_BASE_URL}/${id}`, data);
  return response.data;
};

// 5. 삭제 (DELETE)
export const deleteCategory = async (id: number): Promise<void> => {
  // DELETE는 204 No Content를 반환하므로 응답 데이터가 없습니다.
  await apiClient.delete(`${API_BASE_URL}/${id}`);
};
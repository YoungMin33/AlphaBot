import { apiClient } from '@/lib/apiClient';
import type { SavedMessage } from '@/components/bookmark/bookmark.types';

// 이 API 엔드포인트는 백엔드와 협의된 가상의 경로입니다.
// 깃허브 이슈를 보면 '/api/bookmarks' 또는 '/api/messages/bookmarked' 등을 사용할 수 있습니다.

// 👇 [수정] /api가 중복되지 않도록 '/api'를 제거합니다.
const API_BASE_URL = '/bookmarks'; 

/**
 * 저장된 메시지 목록 조회 (카테고리 ID로 필터링)
 * categoryId 0 = "전체"
 */
export const listSavedMessages = async (categoryId: number): Promise<SavedMessage[]> => {
  let url = API_BASE_URL;
  
  if (categoryId !== 0) {
    // 0이 아닌 특정 카테고리 ID로 필터링
    url = `${API_BASE_URL}?categoryId=${categoryId}`; 
  }
  
  const response = await apiClient.get<SavedMessage[]>(url);
  return response.data;
};

/**
 * 저장된 메시지(북마크) 삭제
 */
export const deleteSavedMessage = async (id: number): Promise<void> => {
  await apiClient.delete(`${API_BASE_URL}/${id}`);
};
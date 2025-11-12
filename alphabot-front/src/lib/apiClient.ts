// src/lib/apiClient.ts
import axios, { AxiosError } from 'axios';

// 실제 환경에서는 localStorage, zustand, context 등에서 토큰을 가져옵니다.
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const apiClient = axios.create({
  // .env 파일 등을 통해 API 서버 주소를 설정합니다.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/', 
});

// 요청 인터셉터: 모든 요청에 인증 토큰(Bearer) 자동 삽입
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 처리 (인증 필요)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 401: 인증 필요 (토큰 만료 등)
      // 실제 앱에서는 /login 페이지로 리디렉션 처리합니다.
      console.error('401 Unauthorized. Redirecting to login...');
      // window.location.href = '/login'; 
    }
    // 다른 에러는 그대로 반환하여 React Query의
    // useQuery/useMutation에서 개별 처리할 수 있도록 합니다.
    return Promise.reject(error);
  }
);
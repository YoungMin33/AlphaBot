// src/lib/apiClient.ts
import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
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

const handleUnauthorized = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('authToken');

  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
};

// 응답 인터셉터: 401 에러 처리 (인증 필요)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized. Redirecting to login...');
      handleUnauthorized();
    }
    // 다른 에러는 그대로 반환하여 React Query의
    // useQuery/useMutation에서 개별 처리할 수 있도록 합니다.
    return Promise.reject(error);
  }
);
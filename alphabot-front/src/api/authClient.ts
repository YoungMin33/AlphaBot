import { apiClient } from '@/lib/apiClient';

export interface SignupPayload {
  login_id: string;
  username: string;
  password: string;
}

export interface SignupResponse {
  user_id: number;
  login_id: string;
  username: string;
}

export const signup = async (payload: SignupPayload): Promise<SignupResponse> => {
  const response = await apiClient.post<SignupResponse>('/api/signup', payload);
  return response.data;
};


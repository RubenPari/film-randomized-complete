import { apiClient } from './apiClient.js';
import { AuthResponse, User } from '../types/index.js';

export const authApi = {
  async login(username: string, password: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', { username, password });
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', { username, email, password });
  },

  async getCurrentUser(token: string | null): Promise<User> {
    return apiClient.get<User>('/auth/me', token);
  },

  async forgotPassword(email: string): Promise<unknown> {
    return apiClient.post<unknown>('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<unknown> {
    return apiClient.post<unknown>('/auth/reset-password', { token, newPassword });
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
    token: string | null,
  ): Promise<unknown> {
    return apiClient.post<unknown>(
      '/auth/change-password',
      { currentPassword, newPassword },
      token,
    );
  },
};

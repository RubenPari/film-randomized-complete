import { apiClient } from './apiClient.js';
import { AuthResponse, MessageResponse, User } from '../types/index.js';

/**
 * API per l'autenticazione
 */
export const authApi = {
  /**
   * Login
   * @param username Nome utente
   * @param password Password
   * @returns Risposta di autenticazione
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', { username, password });
  },

  /**
   * Registrazione
   * @param username Nome utente
   * @param email Email
   * @param password Password
   * @returns Risposta di autenticazione
   */
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', { username, email, password });
  },

  /**
   * Recupera l'utente corrente
   * @param token Token di autenticazione
   * @returns Utente corrente
   */
  async getCurrentUser(token: string | null): Promise<User> {
    return apiClient.get<User>('/auth/me', token);
  },

  /**
   * Recupera la password
   * @param email Email
   * @returns Risposta di autenticazione
   */
  async forgotPassword(email: string): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>('/auth/forgot-password', { email });
  },

  /**
   * Resetta la password
   * @param token Token di autenticazione
   * @param newPassword Nuova password
   * @returns Risposta di autenticazione
   */
  async resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>('/auth/reset-password', { token, newPassword });
  },

  /**
   * Cambia la password
   * @param currentPassword Password corrente
   * @param newPassword Nuova password
   * @param token Token di autenticazione
   * @returns Risposta di autenticazione
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    token: string | null
  ): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>(
      '/auth/change-password',
      { currentPassword, newPassword },
      token
    );
  },
};

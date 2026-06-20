/**
 * Centralized API client for making HTTP requests.
 * Provides a consistent interface for API calls with error handling.
 */

import { ApiError } from '../types/index.js';
export { ApiError };

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api';

/**
 * Gestisce le risposte API
 * @param response Risposta API
 * @returns Risposta API gestita
 */
async function handleApiResponse<T = unknown>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const error = (await response.json()) as { error?: string; detail?: string };
      errorMessage = error.error || error.detail || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new ApiError(errorMessage, response.status);
  }
  return (await response.json()) as T;
}

/**
 * Crea gli header per le richieste API
 * @param token Token di autenticazione
 * @returns Header per le richieste API
 */
function createHeaders(token: string | null = null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Client API per richieste HTTP generiche
 */
export const apiClient = {
  /**
   * Esegue una richiesta GET
   * @param endpoint Endpoint da raggiungere
   * @param token Token di autenticazione
   * @returns Risposta GET
   */
  async get<T = unknown>(endpoint: string, token: string | null = null): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: createHeaders(token),
    });
    return handleApiResponse<T>(response);
  },

  /**
   * Esegue una richiesta POST
   * @param endpoint Endpoint da raggiungere
   * @param body Corpo della richiesta
   * @param token Token di autenticazione
   * @returns Risposta POST
   */
  async post<T = unknown>(
    endpoint: string,
    body: unknown,
    token: string | null = null,
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify(body),
    });
    return handleApiResponse<T>(response);
  },

  /**
   * Esegue una richiesta PUT
   * @param endpoint Endpoint da raggiungere
   * @param body Corpo della richiesta
   * @param token Token di autenticazione
   * @returns Risposta PUT
   */
  async put<T = unknown>(
    endpoint: string,
    body: unknown,
    token: string | null = null,
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: createHeaders(token),
      body: JSON.stringify(body),
    });
    return handleApiResponse<T>(response);
  },

  /**
   * Esegue una richiesta DELETE
   * @param endpoint Endpoint da raggiungere
   * @param token Token di autenticazione
   * @returns Risposta DELETE
   */
  async delete(endpoint: string, token: string | null = null): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: createHeaders(token),
    });

    if (response.status === 204) {
      return;
    }

    return handleApiResponse<void>(response);
  },
};


/**
 * Centralized API client for making HTTP requests.
 * Provides a consistent interface for API calls with error handling.
 */

import { ApiError } from '../types/index.js';
export { ApiError };

const API_BASE_URL: string = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

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

function createHeaders(token: string | null = null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export const apiClient = {
  async get<T = unknown>(endpoint: string, token: string | null = null): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: createHeaders(token),
    });
    return handleApiResponse<T>(response);
  },

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


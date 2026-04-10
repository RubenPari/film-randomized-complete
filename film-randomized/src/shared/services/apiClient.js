/**
 * Centralized API client for making HTTP requests.
 * Provides a consistent interface for API calls with error handling.
 */

/**
 * Base URL for API requests.
 * Uses relative path in production, localhost in development.
 * @type {string}
 */
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

/**
 * Custom error class for API errors.
 * 
 * @class ApiError
 * @extends {Error}
 */
export class ApiError extends Error {
  /**
   * Creates an instance of ApiError.
   * 
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   */
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Handles API response and throws appropriate errors.
 * 
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} Parsed JSON response
 * @throws {ApiError} If response is not ok
 */
async function handleApiResponse(response) {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const error = await response.json();
      errorMessage = error.error || error.detail || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new ApiError(errorMessage, response.status);
  }
  return response.json();
}

/**
 * Creates authorization headers with token.
 * 
 * @param {string|null} token - JWT authentication token
 * @returns {Object} Headers object
 */
function createHeaders(token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Centralized API client.
 * Provides methods for making HTTP requests to the backend API.
 * 
 * @namespace apiClient
 */
export const apiClient = {
  /**
   * Makes a GET request.
   * 
   * @param {string} endpoint - API endpoint path
   * @param {string|null} token - Optional JWT token
   * @returns {Promise<Object>} Promise that resolves to response data
   * @throws {ApiError} If request fails
   */
  async get(endpoint, token = null) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: createHeaders(token),
    });
    return handleApiResponse(response);
  },

  /**
   * Makes a POST request.
   * 
   * @param {string} endpoint - API endpoint path
   * @param {Object} body - Request body data
   * @param {string|null} token - Optional JWT token
   * @returns {Promise<Object>} Promise that resolves to response data
   * @throws {ApiError} If request fails
   */
  async post(endpoint, body, token = null) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify(body),
    });
    return handleApiResponse(response);
  },

  /**
   * Makes a PUT request.
   * 
   * @param {string} endpoint - API endpoint path
   * @param {Object} body - Request body data
   * @param {string|null} token - Optional JWT token
   * @returns {Promise<Object>} Promise that resolves to response data
   * @throws {ApiError} If request fails
   */
  async put(endpoint, body, token = null) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: createHeaders(token),
      body: JSON.stringify(body),
    });
    return handleApiResponse(response);
  },

  /**
   * Makes a DELETE request.
   * 
   * @param {string} endpoint - API endpoint path
   * @param {string|null} token - Optional JWT token
   * @returns {Promise<void>} Promise that resolves when request completes
   * @throws {ApiError} If request fails
   */
  async delete(endpoint, token = null) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: createHeaders(token),
    });
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      return;
    }
    
    return handleApiResponse(response);
  },
};


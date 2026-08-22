import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, ApiError } from './apiClient.js';

/**
 * Test del client API
 */
describe('ApiError', () => {
  /**
   * Test di ApiError
   */
  it('exposes message and status', () => {
    const err = new ApiError('nope', 403);
    expect(err.name).toBe('ApiError');
    expect(err.message).toBe('nope');
    expect(err.status).toBe(403);
  });
});

/**
 * Test del client API
 */
describe('apiClient', () => {
  /**
   * Setup del client API
   */
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        } as Response)
      )
    );
  });

  /**
   * Cleanup del client API
   */
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /**
   * Test GET
   */
  it('get requests JSON and returns parsed body', async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 1 }),
    } as Response);

    const data = await apiClient.get('/foo');

    expect(data).toEqual({ id: 1 });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/foo',
      expect.objectContaining({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  /**
   * Test GET
   */
  it('get sends Authorization when token is provided', async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    } as Response);

    await apiClient.get('/auth/me', 'tok');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer tok',
        },
      })
    );
  });

  /**
   * Test POST
   */
  it('throws ApiError with backend message on error JSON body', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: () => Promise.resolve({ error: 'Invalid payload' }),
    } as Response);

    await expect(apiClient.post('/x', {})).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Invalid payload',
      status: 400,
    });
  });

  it('extracts detailed message over generic error name from NestJS response', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 409,
      statusText: 'Conflict',
      json: () =>
        Promise.resolve({
          statusCode: 409,
          error: 'Conflict',
          message: 'Username already exists',
        }),
    } as Response);

    await expect(apiClient.post('/auth/register', {})).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Username already exists',
      status: 409,
    });
  });

  it('joins array validation error messages from NestJS response', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: () =>
        Promise.resolve({
          statusCode: 400,
          error: 'Bad Request',
          message: ['password must be at least 8 characters', 'email must be an email'],
        }),
    } as Response);

    await expect(apiClient.post('/auth/register', {})).rejects.toMatchObject({
      name: 'ApiError',
      message: 'password must be at least 8 characters, email must be an email',
      status: 400,
    });
  });

  /**
   * Test PUT
   */
  it('throws ApiError with detail when error field missing', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 422,
      statusText: 'Unprocessable',
      json: () => Promise.resolve({ detail: 'Validation failed' }),
    } as Response);

    await expect(apiClient.put('/x', {})).rejects.toMatchObject({
      message: 'Validation failed',
      status: 422,
    });
  });

  /**
   * Test PUT
   */
  it('throws ApiError with HTTP text when JSON body invalid', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      json: () => Promise.reject(new Error('not json')),
    } as Response);

    await expect(apiClient.get('/down')).rejects.toMatchObject({
      message: 'HTTP 502: Bad Gateway',
      status: 502,
    });
  });

  /**
   * Test DELETE
   */
  it('delete returns undefined for 204 No Content', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      status: 204,
      ok: true,
    } as Response);

    await expect(apiClient.delete('/item/1')).resolves.toBeUndefined();
  });
});

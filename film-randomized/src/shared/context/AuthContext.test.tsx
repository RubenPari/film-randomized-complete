import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../types/index.js';
import { AuthProvider, useAuth } from './AuthContext.jsx';

const getCurrentUser = vi.fn();
vi.mock('../services/authApi.js', () => ({
  authApi: { getCurrentUser: (...args: unknown[]) => getCurrentUser(...args) },
}));

const Probe = () => {
  const { loading, token } = useAuth();
  return <p>{loading ? 'loading' : `token:${token}`}</p>;
};

const mount = () =>
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );

describe('AuthProvider session restore', () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    });
    localStorage.setItem('token', 'tok');
    getCurrentUser.mockReset();
  });

  it('keeps the token when the network fails', async () => {
    getCurrentUser.mockRejectedValue(new TypeError('Failed to fetch'));
    mount();
    await waitFor(() => expect(screen.getByText('token:tok')).toBeInTheDocument());
    expect(localStorage.getItem('token')).toBe('tok');
  });

  it('drops the token when the server rejects it', async () => {
    getCurrentUser.mockRejectedValue(new ApiError('Unauthorized', 401));
    mount();
    await waitFor(() => expect(screen.getByText('token:null')).toBeInTheDocument());
    expect(localStorage.getItem('token')).toBeNull();
  });
});

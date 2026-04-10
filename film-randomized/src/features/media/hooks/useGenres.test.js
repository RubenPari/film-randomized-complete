import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useGenres } from './useGenres.js';
import * as tmdbApi from '../../../shared/services/tmdbApi.js';

// Mock the tmdbApi module
vi.mock('../../../shared/services/tmdbApi');

describe('useGenres', () => {
  it('should fetch and return genres', async () => {
    const mockGenres = [{ id: 28, name: 'Action' }];
    vi.mocked(tmdbApi.fetchGenres).mockResolvedValue(mockGenres);

    const { result } = renderHook(() => useGenres());

    // Initially empty
    expect(result.current.genres).toEqual([]);

    // Wait for update
    await waitFor(() => {
      expect(result.current.genres).toEqual(mockGenres);
    });

    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    vi.mocked(tmdbApi.fetchGenres).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGenres());

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch genres. Please try again later.');
    });
  });
});

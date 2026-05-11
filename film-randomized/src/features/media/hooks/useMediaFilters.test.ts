import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMediaFilters } from './useMediaFilters.js';
import { MIN_RELEASE_YEAR } from '../../../shared/constants/config.js';

describe('useMediaFilters', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMediaFilters());

    expect(result.current.mediaType).toBe(true);
    expect(result.current.minRating).toBe(0);
    expect(result.current.maxRating).toBe(10);
    expect(result.current.selectedGenres).toEqual([]);
    expect(result.current.releaseYearFrom).toBe(MIN_RELEASE_YEAR);
  });

  it('should toggle media type', () => {
    const { result } = renderHook(() => useMediaFilters());

    act(() => {
      result.current.setMediaType(false);
    });

    expect(result.current.mediaType).toBe(false);
  });

  it('should toggle genres correctly', () => {
    const { result } = renderHook(() => useMediaFilters());

    // Add genre
    act(() => {
      result.current.handleGenreToggle(28);
    });
    expect(result.current.selectedGenres).toContain(28);

    // Remove genre
    act(() => {
      result.current.handleGenreToggle(28);
    });
    expect(result.current.selectedGenres).not.toContain(28);
  });
});

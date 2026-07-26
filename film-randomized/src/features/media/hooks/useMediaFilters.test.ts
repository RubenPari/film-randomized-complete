import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMediaFilters } from './useMediaFilters.js';
import { MIN_RELEASE_YEAR } from '../../../shared/constants/config.js';

describe('useMediaFilters', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMediaFilters());

    expect(result.current.mediaType).toBe('movie');
    expect(result.current.minRating).toBe(0);
    expect(result.current.maxRating).toBe(10);
    expect(result.current.selectedGenres).toEqual([]);
    expect(result.current.releaseYearFrom).toBe(MIN_RELEASE_YEAR);
  });

  it('resets every filter to the exact discovery defaults', () => {
    const { result } = renderHook(() => useMediaFilters());

    act(() => {
      result.current.setMediaType('tv');
      result.current.setMinRating(6.5);
      result.current.setMaxRating(8.5);
      result.current.setReleaseYearFrom(1999);
      result.current.setReleaseYearTo(2010);
      result.current.setMinVoteCount(10000);
      result.current.handleGenreToggle(28);
    });

    act(() => result.current.resetFilters());

    expect(result.current).toMatchObject({
      mediaType: 'movie',
      minRating: 0,
      maxRating: 10,
      releaseYearFrom: MIN_RELEASE_YEAR,
      releaseYearTo: new Date().getFullYear(),
      minVoteCount: 0,
      selectedGenres: [],
    });
  });

  it('should toggle media type', () => {
    const { result } = renderHook(() => useMediaFilters());

    act(() => {
      result.current.setMediaType('tv');
    });

    expect(result.current.mediaType).toBe('tv');
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

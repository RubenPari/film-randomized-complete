import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMediaFetcher } from './useMediaFetcher.js';
import { pickRandomValidMedia } from '../../../shared/utils/pickRandomValidMedia.js';
import type { MediaFilters } from '../../../shared/types/index.js';

const loadExclusionList = vi.fn().mockResolvedValue([]);

vi.mock('../../../shared/context/AuthContext.jsx', () => ({
  useAuth: () => ({ token: null, user: { id: 7 } }),
}));

vi.mock('./useMediaExclusionList.js', () => ({
  useMediaExclusionList: () => loadExclusionList,
}));

vi.mock('../../../shared/services/tmdbApi.js', () => ({
  discoverMedia: vi.fn().mockResolvedValue({ discoverUrl: '/discover', totalPages: 1 }),
  fetchMediaPage: vi.fn(),
  fetchMediaDetails: vi.fn(),
}));

vi.mock('../../../shared/services/discoveredApi.js', () => ({
  recordDiscovered: vi.fn(),
}));

vi.mock('../../../shared/utils/pickRandomValidMedia.js', () => ({
  pickRandomValidMedia: vi.fn(),
}));

vi.mock('../../../shared/services/recommendationFeedbackStore.js', () => ({
  buildFeedbackRecord: vi.fn(),
  buildRecommendationProfile: vi.fn().mockReturnValue({}),
  getMediaFeedbackValue: vi.fn().mockReturnValue(null),
  loadRecommendationFeedback: vi.fn().mockReturnValue([]),
  saveRecommendationFeedback: vi.fn().mockReturnValue([]),
}));

const FILTERS: MediaFilters = {
  minRating: 0,
  maxRating: 10,
  selectedGenres: [],
  releaseYearFrom: 1900,
  releaseYearTo: new Date().getFullYear(),
  minVoteCount: 0,
};

describe('useMediaFetcher generated media type', () => {
  beforeEach(() => vi.clearAllMocks());

  it('keeps result and media type paired across a failed generation', async () => {
    vi.mocked(pickRandomValidMedia)
      .mockResolvedValueOnce({ media: { id: 1, name: 'TV result' }, explanationKeys: [] })
      .mockRejectedValueOnce(new Error('movie failed'))
      .mockResolvedValueOnce({ media: { id: 2, title: 'Movie result' }, explanationKeys: [] });
    const { result } = renderHook(() => useMediaFetcher());

    await act(() => result.current.generateRandomMedia(FILTERS, 'tv'));
    expect(result.current.randomMedia?.id).toBe(1);
    expect(result.current.generatedMediaType).toBe('tv');

    await act(() => result.current.generateRandomMedia(FILTERS, 'movie'));
    expect(result.current.error).toBe('movie failed');
    expect(result.current.randomMedia?.id).toBe(1);
    expect(result.current.generatedMediaType).toBe('tv');

    await act(() => result.current.generateRandomMedia(FILTERS, 'movie'));
    expect(result.current.error).toBeNull();
    expect(result.current.randomMedia?.id).toBe(2);
    expect(result.current.generatedMediaType).toBe('movie');
  });
});

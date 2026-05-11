import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pickRandomValidMedia } from './pickRandomValidMedia.js';

const ITALIAN_EMPTY = 'Nessuna descrizione disponibile in italiano.';

function makeMovie(id: number, overview = `A valid overview for ${id}.`) {
  return { id, title: `Movie ${id}`, overview };
}

describe('pickRandomValidMedia', () => {
  beforeEach(() => {
    // Pin Math.random so retries are deterministic. 0.0 → getRandomPage
    // returns 1 and getRandomMedia returns the first element.
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns details for the first valid candidate it encounters', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValue({ results: [makeMovie(1), makeMovie(2)] });
    const fetchDetails = vi.fn().mockResolvedValue(makeMovie(1));

    const result = await pickRandomValidMedia({
      fetchPage,
      fetchDetails,
      totalPages: 10,
      mediaType: 'movie',
    });

    expect(result.id).toBe(1);
    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(fetchDetails).toHaveBeenCalledWith('movie', 1);
  });

  it('retries when every candidate on the page is excluded', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce({ results: [makeMovie(10), makeMovie(11)] })
      .mockResolvedValueOnce({ results: [makeMovie(20)] });
    const fetchDetails = vi.fn().mockResolvedValue(makeMovie(20));

    const result = await pickRandomValidMedia({
      fetchPage,
      fetchDetails,
      totalPages: 5,
      mediaType: 'movie',
      excludedItems: [
        { tmdb_id: 10, media_type: 'movie' },
        { tmdb_id: 11, media_type: 'movie' },
      ],
      maxAttempts: 3,
    });

    expect(result.id).toBe(20);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('retries when the fetched details turn out to have no description', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce({ results: [makeMovie(1)] })
      .mockResolvedValueOnce({ results: [makeMovie(2)] });
    const fetchDetails = vi
      .fn()
      .mockResolvedValueOnce({ ...makeMovie(1), overview: ITALIAN_EMPTY })
      .mockResolvedValueOnce(makeMovie(2));

    const result = await pickRandomValidMedia({
      fetchPage,
      fetchDetails,
      totalPages: 10,
      mediaType: 'movie',
      maxAttempts: 3,
    });

    expect(result.id).toBe(2);
    expect(fetchDetails).toHaveBeenCalledTimes(2);
  });

  it('throws after exhausting the retry budget', async () => {
    const fetchPage = vi.fn().mockResolvedValue({ results: [] });
    const fetchDetails = vi.fn();

    await expect(
      pickRandomValidMedia({
        fetchPage,
        fetchDetails,
        totalPages: 10,
        mediaType: 'movie',
        maxAttempts: 2,
      }),
    ).rejects.toThrow('No content found');

    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(fetchDetails).not.toHaveBeenCalled();
  });

  it('accepts legacy boolean mediaType for the details call', async () => {
    const fetchPage = vi.fn().mockResolvedValue({ results: [makeMovie(1)] });
    const fetchDetails = vi.fn().mockResolvedValue(makeMovie(1));

    await pickRandomValidMedia({
      fetchPage,
      fetchDetails,
      totalPages: 1,
      mediaType: false, // legacy: false = tv
    });

    expect(fetchDetails).toHaveBeenCalledWith('tv', 1);
  });
});

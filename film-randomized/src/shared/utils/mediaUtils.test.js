import { describe, it, expect } from 'vitest';
import { getMediaType, matchesMediaListFilter } from './mediaUtils.js';

describe('getMediaType', () => {
  it('reads snake_case and camelCase', () => {
    expect(getMediaType({ media_type: 'movie' })).toBe('movie');
    expect(getMediaType({ mediaType: 'tv' })).toBe('tv');
  });

  it('maps legacy booleans', () => {
    expect(getMediaType({ media_type: true })).toBe('movie');
    expect(getMediaType({ media_type: false })).toBe('tv');
  });

  it('returns null for unknown', () => {
    expect(getMediaType({ media_type: 'other' })).toBe(null);
  });
});

describe('matchesMediaListFilter', () => {
  it('all passes any item with known type', () => {
    expect(matchesMediaListFilter({ media_type: 'movie' }, 'all')).toBe(true);
  });

  it('movies and tv match normalized type', () => {
    expect(matchesMediaListFilter({ mediaType: 'movie' }, 'movies')).toBe(true);
    expect(matchesMediaListFilter({ media_type: 'tv' }, 'tv')).toBe(true);
    expect(matchesMediaListFilter({ media_type: 'movie' }, 'tv')).toBe(false);
  });

  it('unknown type does not match movies or tv', () => {
    expect(matchesMediaListFilter({}, 'movies')).toBe(false);
  });
});

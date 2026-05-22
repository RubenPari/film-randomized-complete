import { describe, it, expect } from 'vitest';
import { getMediaType, matchesMediaListFilter } from './mediaUtils.js';

/**
 * Gruppo di test per getMediaType
 */
describe('getMediaType', () => {
  /**
   * Test case per leggere snake_case e camelCase
   */
  it('reads snake_case and camelCase', () => {
    expect(getMediaType({ media_type: 'movie' })).toBe('movie');
    expect(getMediaType({ mediaType: 'tv' })).toBe('tv');
  });

  /**
   * Test case per mappare i booleani legacy
   */
  it('maps legacy booleans', () => {
    expect(getMediaType({ media_type: true })).toBe('movie');
    expect(getMediaType({ media_type: false })).toBe('tv');
  });

  /**
   * Test case per ritornare null per tipo sconosciuto
   */
  it('returns null for unknown', () => {
    expect(getMediaType({ media_type: 'other' })).toBe(null);
  });
});

/**
 * Gruppo di test per matchesMediaListFilter
 */
describe('matchesMediaListFilter', () => {
  /**
   * Test case per all che passa qualsiasi item con tipo noto
   */
  it('all passes any item with known type', () => {
    expect(matchesMediaListFilter({ media_type: 'movie' }, 'all')).toBe(true);
  });

  /**
   * Test case per movies e tv che corrispondono al tipo normalizzato
   */
  it('movies and tv match normalized type', () => {
    expect(matchesMediaListFilter({ mediaType: 'movie' }, 'movies')).toBe(true);
    expect(matchesMediaListFilter({ media_type: 'tv' }, 'tv')).toBe(true);
    expect(matchesMediaListFilter({ media_type: 'movie' }, 'tv')).toBe(false);
  });

  /**
   * Test case per tipo sconosciuto che non corrisponde a movies o tv
   */
  it('unknown type does not match movies or tv', () => {
    expect(matchesMediaListFilter({}, 'movies')).toBe(false);
  });
});

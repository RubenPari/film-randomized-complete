import { describe, expect, it } from 'vitest';
import { NoContentError, TmdbError } from '../../../shared/types/index.js';
import { classifyGenerationError } from './useMediaFetcher.js';

describe('classifyGenerationError', () => {
  it('maps errors to a kind', () => {
    expect(classifyGenerationError(new NoContentError())).toBe('noMatch');
    expect(classifyGenerationError(new TmdbError('x', 404))).toBe('noMatch');
    expect(classifyGenerationError(new TypeError('Failed to fetch'))).toBe('network');
    expect(classifyGenerationError(new TmdbError('x', 503))).toBe('network');
    expect(classifyGenerationError(new Error('boom'))).toBe('generic');
  });
});

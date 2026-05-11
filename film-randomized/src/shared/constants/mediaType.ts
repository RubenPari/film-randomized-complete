import { MediaType } from '../types/index.js';

export const MEDIA_TYPE = Object.freeze({
  MOVIE: 'movie',
  TV: 'tv',
}) as { readonly MOVIE: 'movie'; readonly TV: 'tv' };

export function toMediaType(value: boolean | MediaType): MediaType {
  if (value === MEDIA_TYPE.MOVIE || value === MEDIA_TYPE.TV) return value as MediaType;
  return value === true ? MEDIA_TYPE.MOVIE : MEDIA_TYPE.TV;
}

export function isMovie(value: MediaType): boolean {
  return value === MEDIA_TYPE.MOVIE;
}

export function isTv(value: MediaType): boolean {
  return value === MEDIA_TYPE.TV;
}

import { MediaType } from '../types/index.js';

interface MediaRow extends Record<string, unknown> {
  tmdb_id?: number;
  tmdbId?: number | string;
  media_type?: MediaType | string | boolean;
  mediaType?: boolean | MediaType | string;
}

export function getMediaType(item: MediaRow): MediaType | null {
  const mt = item.media_type ?? item.mediaType;
  if (mt === true) return 'movie';
  if (mt === false) return 'tv';
  if (mt === 'movie' || mt === 'tv') return mt as MediaType;
  return null;
}

export function matchesMediaListFilter(item: MediaRow, filter: 'all' | 'movies' | 'tv'): boolean {
  if (filter === 'all') return true;
  const mt = getMediaType(item);
  if (!mt) return false;
  if (filter === 'movies') return mt === 'movie';
  if (filter === 'tv') return mt === 'tv';
  return true;
}

export function resolveMediaTypeString(mediaType: boolean | MediaType): MediaType {
  return mediaType === true || mediaType === 'movie' ? 'movie' : 'tv';
}

export function isExcludedForCurrentType(
  tmdbId: number,
  currentMediaType: MediaType,
  excludedItems: MediaRow[],
): boolean {
  if (!excludedItems || excludedItems.length === 0) return false;
  return excludedItems.some(function (item) {
    const id = item.tmdb_id ?? item.tmdbId;
    const mt = getMediaType(item);
    return id === tmdbId && mt === currentMediaType;
  });
}

export function filterValidMedia(
  results: { id: number; overview?: string }[],
  excludedItems: MediaRow[] = [],
  currentMediaType: boolean | MediaType,
): { id: number; overview?: string }[] {
  const mt = resolveMediaTypeString(currentMediaType);
  return results.filter(function (media) {
    const excluded = isExcludedForCurrentType(media.id, mt, excludedItems);

    return (
      !excluded &&
      media.overview &&
      media.overview.trim() !== '' &&
      media.overview !== 'Nessuna descrizione disponibile in italiano.'
    );
  });
}

export function hasValidDescription(media: { overview?: string }): boolean {
  return (
    !!media.overview &&
    media.overview.trim() !== '' &&
    media.overview !== 'Nessuna descrizione disponibile in italiano.'
  );
}

export function getRandomPage(totalPages: number): number {
  return Math.floor(Math.random() * totalPages) + 1;
}

export function getRandomMedia<T>(mediaArray: T[]): T {
  const randomIndex = Math.floor(Math.random() * mediaArray.length);
  return mediaArray[randomIndex];
}

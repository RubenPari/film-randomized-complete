import { MediaType } from '../types/index.js';
import { toMediaType } from '../constants/mediaType.js';

/**
 * Interfaccia per i media da filtrare
 */
export interface MediaRow {
  tmdb_id?: number;
  tmdbId?: number | string;
  media_type?: MediaType | string | boolean;
  mediaType?: boolean | MediaType | string;
}

/**
 * Ottiene il tipo di media
 * @param item Item del media
 * @returns Tipo di media
 */
export function getMediaType(item: MediaRow): MediaType | null {
  const mt = item.media_type ?? item.mediaType;
  if (mt === true) return 'movie';
  if (mt === false) return 'tv';
  if (mt === 'movie' || mt === 'tv') return mt as MediaType;
  return null;
}

/**
 * Controlla se il media corrisponde al filtro
 * @param item Item del media
 * @param filter Filtro da applicare
 * @returns True se il media corrisponde al filtro, false altrimenti
 */
export function matchesMediaListFilter(item: MediaRow, filter: 'all' | 'movies' | 'tv'): boolean {
  if (filter === 'all') return true;
  const mt = getMediaType(item);
  if (!mt) return false;
  if (filter === 'movies') return mt === 'movie';
  if (filter === 'tv') return mt === 'tv';
  return true;
}

/**
 * Controlla se il media è escluso per il tipo corrente
 * @param tmdbId ID del media
 * @param currentMediaType Tipo di media corrente
 * @param excludedItems Lista di media esclusi
 * @returns True se il media è escluso, false altrimenti
 */
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

/**
 * Filtra i media validi
 * @param results Lista di media da filtrare
 * @param excludedItems Lista di media esclusi
 * @param currentMediaType Tipo di media corrente
 * @returns Lista di media validi
 */
export function filterValidMedia(
  results: { id: number; overview?: string }[],
  excludedItems: MediaRow[] = [],
  currentMediaType: MediaType,
): { id: number; overview?: string }[] {
  const mt = toMediaType(currentMediaType);
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

/**
 * Controlla se il media ha una descrizione valida
 * @param media Media da controllare
 * @returns True se il media ha una descrizione valida, false altrimenti
 */
export function hasValidDescription(media: { overview?: string }): boolean {
  return (
    !!media.overview &&
    media.overview.trim() !== '' &&
    media.overview !== 'Nessuna descrizione disponibile in italiano.'
  );
}

/**
 * Ottiene un numero di pagina casuale
 * @param totalPages Numero totale di pagine
 * @returns Numero di pagina casuale
 */
export function getRandomPage(totalPages: number): number {
  return Math.floor(Math.random() * totalPages) + 1;
}

/**
 * Ottiene un media casuale da un array
 * @param mediaArray Array di media
 * @returns Media casuale
 */
export function getRandomMedia<T>(mediaArray: T[]): T {
  const randomIndex = Math.floor(Math.random() * mediaArray.length);
  return mediaArray[randomIndex];
}

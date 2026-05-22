import { apiClient, ApiError } from './apiClient.js';
import { normalizeMediaItem, NormalizableItem } from '../utils/normalizeMediaItem.js';
import { MediaItem, TmdbMedia, MediaType } from '../types/index.js';
import { toMediaType } from '../constants/mediaType.js';
import { buildBackendMediaPayload } from './mediaPayload.js';

/**
 * Aggiunge un media alla watchlist
 * @param media Media da aggiungere
 * @param mediaType Tipo di media
 * @param token Token di autenticazione
 * @returns Media aggiunto alla watchlist
 */
export async function addToWatchlist(
  media: TmdbMedia,
  mediaType: MediaType,
  token: string | null,
): Promise<MediaItem> {
  const payload = buildBackendMediaPayload(media, toMediaType(mediaType));

  const created = await apiClient.post<NormalizableItem>('/watchlist', payload, token);
  return normalizeMediaItem(created) as MediaItem;
}

/**
 * Recupera la watchlist dell'utente
 * @param token Token di autenticazione
 * @returns Lista dei media nella watchlist
 */
export async function getWatchlist(token: string | null): Promise<MediaItem[]> {
  const list = await apiClient.get<unknown[]>('/watchlist', token);
  return Array.isArray(list)
    ? (list as NormalizableItem[]).map((item) => normalizeMediaItem(item) as MediaItem)
    : [];
}

/**
 * Verifica se un media è presente nella watchlist
 * @param tmdbId ID del media
 * @param token Token di autenticazione
 * @returns True se il media è presente nella watchlist, false altrimenti
 */
export async function checkInWatchlist(tmdbId: number, token: string | null): Promise<boolean> {
  try {
    const data = await apiClient.get<NormalizableItem>(`/watchlist/${tmdbId}`, token);
    const id = data.tmdb_id ?? data.tmdbId;
    return Boolean(data && id === tmdbId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Rimuove un media dalla watchlist
 * @param tmdbId ID del media
 * @param token Token di autenticazione
 */
export async function removeFromWatchlist(tmdbId: number, token: string | null): Promise<void> {
  return apiClient.delete(`/watchlist/${tmdbId}`, token);
}

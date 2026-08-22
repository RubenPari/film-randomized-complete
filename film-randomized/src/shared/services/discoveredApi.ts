import { apiClient } from './apiClient.js';
import { normalizeMediaItem, NormalizableItem } from '../utils/normalizeMediaItem.js';
import { MediaItem, TmdbMedia, MediaType } from '../types/index.js';
import { toMediaType } from '../constants/mediaType.js';
import { buildBackendMediaPayload } from './mediaPayload.js';

/**
 * Recupera i media scoperti
 * @param token Token di autenticazione
 * @returns Lista dei media scoperti
 */
export async function getDiscovered(token: string | null): Promise<MediaItem[]> {
  const list = await apiClient.get<unknown[]>('/discovered', token);
  return Array.isArray(list)
    ? (list as NormalizableItem[]).map((item) => normalizeMediaItem(item) as MediaItem)
    : [];
}

/**
 * Registra un media scoperto
 * @param media Media da registrare
 * @param mediaType Tipo di media
 * @param token Token di autenticazione
 * @returns Media registrato
 */
export async function recordDiscovered(
  media: TmdbMedia,
  mediaType: MediaType,
  token: string | null
): Promise<MediaItem> {
  const payload = buildBackendMediaPayload(media, toMediaType(mediaType));

  const created = await apiClient.post<NormalizableItem>('/discovered', payload, token);
  return normalizeMediaItem(created) as MediaItem;
}

/**
 * Rimuove un media scoperto
 * @param mediaType Tipo di media
 * @param tmdbId ID del media
 * @param token Token di autenticazione
 */
export async function removeDiscovered(
  mediaType: MediaType,
  tmdbId: number,
  token: string | null
): Promise<void> {
  return apiClient.delete(`/discovered/${mediaType}/${tmdbId}`, token);
}

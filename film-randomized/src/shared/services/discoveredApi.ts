import { apiClient } from './apiClient.js';
import { normalizeMediaItem, NormalizableItem } from '../utils/normalizeMediaItem.js';
import { MediaItem, TmdbMedia, MediaType } from '../types/index.js';
import { toMediaType } from '../constants/mediaType.js';
import { buildBackendMediaPayload } from './mediaPayload.js';

export async function getDiscovered(token: string | null): Promise<MediaItem[]> {
  const list = await apiClient.get<unknown[]>('/discovered', token);
  return Array.isArray(list)
    ? (list as NormalizableItem[]).map((item) => normalizeMediaItem(item) as MediaItem)
    : [];
}

export async function recordDiscovered(
  media: TmdbMedia,
  mediaType: MediaType,
  token: string | null,
): Promise<MediaItem> {
  const payload = buildBackendMediaPayload(media, toMediaType(mediaType));

  const created = await apiClient.post<NormalizableItem>('/discovered', payload, token);
  return normalizeMediaItem(created) as MediaItem;
}

export async function removeDiscovered(
  mediaType: MediaType,
  tmdbId: number,
  token: string | null,
): Promise<void> {
  return apiClient.delete(`/discovered/${mediaType}/${tmdbId}`, token);
}

import { apiClient, ApiError } from './apiClient.js';
import { normalizeMediaItem, NormalizableItem } from '../utils/normalizeMediaItem.js';
import { MediaItem, TmdbMedia, MediaType } from '../types/index.js';

export async function addToWatchlist(
  media: TmdbMedia,
  mediaType: boolean | MediaType,
  token: string | null,
): Promise<MediaItem> {
  const mediaTypeStr: MediaType =
    mediaType === true || mediaType === 'movie' ? 'movie' : 'tv';

  const payload = {
    tmdb_id: media.id,
    media_type: mediaTypeStr,
    title: media.title || media.name,
    original_title: media.original_title || media.original_name,
    overview: media.overview,
    poster_path: media.poster_path,
    backdrop_path: media.backdrop_path,
    vote_average: media.vote_average,
    vote_count: media.vote_count,
    release_date: media.release_date || media.first_air_date,
    genres: JSON.stringify(media.genres || []),
    runtime: media.runtime || null,
    number_of_seasons: media.number_of_seasons || null,
    number_of_episodes: media.number_of_episodes || null,
  };

  const created = await apiClient.post<NormalizableItem>('/watchlist', payload, token);
  return normalizeMediaItem(created) as MediaItem;
}

export async function getWatchlist(token: string | null): Promise<MediaItem[]> {
  const list = await apiClient.get<unknown[]>('/watchlist', token);
  return Array.isArray(list)
    ? (list as NormalizableItem[]).map((item) => normalizeMediaItem(item) as MediaItem)
    : [];
}

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

export async function removeFromWatchlist(tmdbId: number, token: string | null): Promise<void> {
  return apiClient.delete(`/watchlist/${tmdbId}`, token);
}

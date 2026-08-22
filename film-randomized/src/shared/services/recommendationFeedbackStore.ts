import type {
  MediaFeedbackReason,
  MediaFeedbackValue,
  MediaType,
  RecommendationFeedback,
  RecommendationProfile,
  TmdbMedia,
} from '../types/index.js';
import type { MediaRow } from '../utils/mediaUtils.js';

const STORAGE_PREFIX = 'film-randomized-feedback-v1';
const SMART_EXCLUSION_REPEAT_THRESHOLD = 2;

function storageKey(userId: string | number | null | undefined): string {
  return `${STORAGE_PREFIX}:${userId ?? 'guest'}`;
}

function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadRecommendationFeedback(
  userId: string | number | null | undefined
): RecommendationFeedback[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as RecommendationFeedback[];
  } catch {
    return [];
  }
}

export function saveRecommendationFeedback(
  userId: string | number | null | undefined,
  feedback: RecommendationFeedback
): RecommendationFeedback[] {
  const storage = getStorage();
  if (!storage) return [];
  const existing = loadRecommendationFeedback(userId);
  const next = [feedback, ...existing].slice(0, 400);
  storage.setItem(storageKey(userId), JSON.stringify(next));
  return next;
}

export function getMediaFeedbackValue(
  history: RecommendationFeedback[],
  tmdbId: number,
  mediaType: MediaType
): MediaFeedbackValue | null {
  const found = history.find((item) => item.tmdb_id === tmdbId && item.media_type === mediaType);
  return found?.value ?? null;
}

export function buildRecommendationProfile(
  history: RecommendationFeedback[]
): RecommendationProfile {
  const likedGenreCount = new Map<number, number>();
  const dislikedGenreCount = new Map<number, number>();
  const dislikedMediaCount = new Map<string, number>();
  let likedCount = 0;

  history.forEach((item) => {
    if (item.value === 'like') {
      likedCount += 1;
      item.genre_ids.forEach((genreId) => {
        likedGenreCount.set(genreId, (likedGenreCount.get(genreId) ?? 0) + 1);
      });
      return;
    }

    item.genre_ids.forEach((genreId) => {
      dislikedGenreCount.set(genreId, (dislikedGenreCount.get(genreId) ?? 0) + 1);
    });
    const mediaKey = `${item.media_type}-${item.tmdb_id}`;
    dislikedMediaCount.set(mediaKey, (dislikedMediaCount.get(mediaKey) ?? 0) + 1);
    if (item.reason === 'already_seen') {
      dislikedMediaCount.set(mediaKey, SMART_EXCLUSION_REPEAT_THRESHOLD);
    }
  });

  return {
    likedGenreIds: [...likedGenreCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([genreId]) => genreId),
    dislikedGenreIds: [...dislikedGenreCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([genreId]) => genreId),
    dislikedMediaKeys: [...dislikedMediaCount.entries()]
      .filter(([, count]) => count >= SMART_EXCLUSION_REPEAT_THRESHOLD)
      .map(([key]) => key),
    likedCount,
  };
}

export function buildSmartExclusionRows(history: RecommendationFeedback[]): MediaRow[] {
  const profile = buildRecommendationProfile(history);
  return profile.dislikedMediaKeys.map((key) => {
    const [media_type, id] = key.split('-');
    return {
      media_type: media_type as MediaType,
      tmdb_id: Number(id),
    };
  });
}

export function buildFeedbackRecord(
  media: TmdbMedia,
  mediaType: MediaType,
  value: MediaFeedbackValue,
  reason?: MediaFeedbackReason
): RecommendationFeedback {
  const releaseYearRaw = media.release_date || media.first_air_date;
  return {
    tmdb_id: media.id,
    media_type: mediaType,
    genre_ids: Array.isArray(media.genres) ? media.genres.map((genre) => genre.id) : [],
    vote_average: media.vote_average,
    release_year: releaseYearRaw ? Number(releaseYearRaw.slice(0, 4)) : undefined,
    value,
    reason,
    created_at: new Date().toISOString(),
  };
}

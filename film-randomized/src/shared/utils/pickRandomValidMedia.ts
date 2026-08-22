import {
  filterValidMedia,
  getRandomMedia,
  getRandomPage,
  hasValidDescription,
  isExcludedForCurrentType,
  type MediaRow,
} from './mediaUtils.js';
import { MediaType, RecommendationProfile, TmdbMedia, TmdbPageResponse } from '../types/index.js';

/**
 * Interfaccia per le opzioni di pickRandomValidMedia
 */
interface PickRandomValidMediaOptions {
  fetchPage: (page: number) => Promise<TmdbPageResponse>;
  fetchDetails: (mediaType: MediaType, id: number) => Promise<TmdbMedia>;
  totalPages: number;
  mediaType: MediaType;
  excludedItems?: MediaRow[];
  recommendationProfile?: RecommendationProfile;
  maxAttempts?: number;
}
export interface PickedMediaResult {
  media: TmdbMedia;
  explanationKeys: string[];
}

interface CandidateWithScore {
  id: number;
  overview?: string;
  vote_average?: number;
  genre_ids?: number[];
  release_date?: string;
  first_air_date?: string;
  score: number;
}

function scoreCandidate(
  candidate: {
    vote_average?: number;
    genre_ids?: number[];
  },
  profile?: RecommendationProfile
): number {
  const ratingScore = Math.max(0.2, (candidate.vote_average ?? 0) / 8);
  if (!profile) return ratingScore;

  const genreIds = candidate.genre_ids ?? [];
  const likedOverlap = genreIds.filter((id) => profile.likedGenreIds.includes(id)).length;
  const dislikedOverlap = genreIds.filter((id) => profile.dislikedGenreIds.includes(id)).length;
  const preferenceScore = likedOverlap * 0.7 - dislikedOverlap * 0.5;

  return Math.max(0.1, ratingScore + preferenceScore);
}

function pickWeightedCandidate(candidates: CandidateWithScore[]): CandidateWithScore {
  const totalWeight = candidates.reduce((sum, candidate) => sum + candidate.score, 0);
  if (totalWeight <= 0) return getRandomMedia(candidates);

  let draw = Math.random() * totalWeight;
  for (const candidate of candidates) {
    draw -= candidate.score;
    if (draw <= 0) return candidate;
  }
  return candidates[candidates.length - 1];
}

function buildExplanationKeys(media: TmdbMedia, profile?: RecommendationProfile): string[] {
  const keys: string[] = [];
  if ((media.vote_average ?? 0) >= 7.5) {
    keys.push('recommendation.highRating');
  }
  if (profile?.likedGenreIds.length && Array.isArray(media.genres)) {
    const overlap = media.genres.some((genre) => profile.likedGenreIds.includes(genre.id));
    if (overlap) keys.push('recommendation.matchesPreferredGenres');
  }
  if ((profile?.likedCount ?? 0) > 0) {
    keys.push('recommendation.personalizedFromFeedback');
  }
  keys.push('recommendation.freshPick');
  return [...new Set(keys)].slice(0, 3);
}

/**
 * Seleziona un media casuale valido tra i candidati
 * @param fetchPage Funzione per recuperare una pagina di media
 * @param fetchDetails Funzione per recuperare i dettagli di un media
 * @param totalPages Numero totale di pagine
 * @param mediaType Tipo di media da recuperare
 * @param excludedItems Lista di media esclusi
 * @param recommendationProfile Profilo preferenze utente derivato dai feedback
 * @param maxAttempts Numero massimo di tentativi
 * @returns Media valido selezionato casualmente
 */
export async function pickRandomValidMedia({
  fetchPage,
  fetchDetails,
  totalPages,
  mediaType,
  excludedItems = [],
  recommendationProfile,
  maxAttempts = 5,
}: PickRandomValidMediaOptions): Promise<PickedMediaResult> {
  const mt = mediaType;

  /**
   * Ciclo di tentativi per trovare un media valido
   */
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    // Selezione casuale di una pagina
    const page = getRandomPage(totalPages);
    // Recupero della pagina di media
    const pageData = await fetchPage(page);
    // Filtraggio dei media validi
    const validCandidates = filterValidMedia(pageData?.results ?? [], excludedItems, mediaType);
    if (validCandidates.length === 0) continue;

    const candidates = validCandidates.map((candidate) => ({
      ...candidate,
      score: scoreCandidate(candidate, recommendationProfile),
    }));
    const candidate = pickWeightedCandidate(candidates);
    // Recupero dei dettagli del candidato
    const details = await fetchDetails(mt, candidate.id);

    // Controllo se il candidato è valido
    if (hasValidDescription(details) && !isExcludedForCurrentType(details.id, mt, excludedItems)) {
      return {
        media: details,
        explanationKeys: buildExplanationKeys(details, recommendationProfile),
      };
    }
  }

  throw new Error('No content found. Try modifying the filters.');
}

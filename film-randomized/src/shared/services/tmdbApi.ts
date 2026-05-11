/**
 * TMDB API Service
 * Handles all interactions with The Movie Database API
 */
import { API_ENDPOINTS } from '../constants/api.js';
import { TMDB_MAX_PAGE } from '../constants/config.js';
import { tmdbClient, TmdbError } from './tmdbClient.js';
import {
  MediaType,
  MediaFilters,
  TmdbDiscoverResult,
  TmdbPageResponse,
  TmdbGenreListResponse,
  TmdbVideosResponse,
  Genre,
  TmdbMedia,
} from '../types/index.js';

export const discoverMedia = async (
  mediaType: boolean,
  filters: MediaFilters,
): Promise<TmdbDiscoverResult> => {
  const mediaTypeParam: MediaType = mediaType ? 'movie' : 'tv';
  const endpoint = API_ENDPOINTS.discover(mediaTypeParam);
  const urlParams = new URLSearchParams();

  urlParams.append('vote_average.gte', String(filters.minRating));
  urlParams.append('vote_average.lte', String(filters.maxRating));

  if (filters.selectedGenres && filters.selectedGenres.length > 0) {
    urlParams.append('with_genres', filters.selectedGenres.join(','));
  }

  if (filters.releaseYearFrom) {
    urlParams.append(
      mediaType ? 'primary_release_date.gte' : 'first_air_date.gte',
      `${filters.releaseYearFrom}-01-01`,
    );
  }

  if (filters.releaseYearTo) {
    urlParams.append(
      mediaType ? 'primary_release_date.lte' : 'first_air_date.lte',
      `${filters.releaseYearTo}-12-31`,
    );
  }

  if (filters.minVoteCount > 0) {
    urlParams.append('vote_count.gte', String(filters.minVoteCount));
  }

  const data = await tmdbClient.get<TmdbPageResponse>(`${endpoint}?${urlParams.toString()}`);

  if (data.results.length === 0) {
    throw new TmdbError('No results found with these filters', 404);
  }

  return {
    discoverUrl: `${endpoint}?${urlParams.toString()}`,
    totalPages: Math.min(data.total_pages, TMDB_MAX_PAGE),
  };
};

export const fetchMediaPage = async (
  discoverUrl: string,
  pageNumber: number,
): Promise<TmdbPageResponse> => {
  return tmdbClient.get<TmdbPageResponse>(`${discoverUrl}&page=${pageNumber}`);
};

export const fetchMediaDetails = async (
  mediaType: boolean,
  mediaId: number,
): Promise<TmdbMedia> => {
  const mediaTypeParam: MediaType = mediaType ? 'movie' : 'tv';
  const endpoint = API_ENDPOINTS.details(mediaTypeParam, mediaId);
  return tmdbClient.get<TmdbMedia>(endpoint);
};

export const fetchMediaVideos = async (
  mediaType: boolean,
  mediaId: number,
): Promise<TmdbVideosResponse> => {
  const mediaTypeParam: MediaType = mediaType ? 'movie' : 'tv';
  const endpoint = API_ENDPOINTS.videos(mediaTypeParam, mediaId);
  const data = await tmdbClient.get<TmdbVideosResponse>(endpoint);

  if (!data.results || data.results.length === 0) {
    const responseEn = await tmdbClient.fetchRaw<TmdbVideosResponse>(
      `${endpoint}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`,
    );
    return responseEn;
  }

  return data;
};

let cachedGenres: Genre[] | null = null;
let cachedGenresPromise: Promise<Genre[]> | null = null;

export const fetchGenres = async (): Promise<Genre[]> => {
  if (cachedGenres) return cachedGenres;

  if (!cachedGenresPromise) {
    cachedGenresPromise = (async () => {
      try {
        const [movieData, tvData] = await Promise.all([
          tmdbClient.get<TmdbGenreListResponse>(API_ENDPOINTS.movieGenres),
          tmdbClient.get<TmdbGenreListResponse>(API_ENDPOINTS.tvGenres),
        ]);

        const uniqueGenresMap = new Map<number, Genre>();

        movieData.genres.forEach((genre: Genre) => {
          uniqueGenresMap.set(genre.id, genre);
        });

        tvData.genres.forEach((genre: Genre) => {
          if (!uniqueGenresMap.has(genre.id)) {
            uniqueGenresMap.set(genre.id, genre);
          }
        });

        cachedGenres = Array.from(uniqueGenresMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        return cachedGenres;
      } catch (error) {
        cachedGenresPromise = null;
        throw error;
      }
    })();
  }

  return cachedGenresPromise;
};

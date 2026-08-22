/**
 * TMDB API Service
 * Handles all interactions with The Movie Database API
 */
import { API_ENDPOINTS, API_KEY } from '../constants/api.js';
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

/**
 * Scopre media con i filtri specificati
 * @param mediaType Tipo di media
 * @param filters Filtri di ricerca
 * @returns Risultati della scoperta
 */
export const discoverMedia = async (
  mediaType: MediaType,
  filters: MediaFilters
): Promise<TmdbDiscoverResult> => {
  // Prendo l'endpoint di scoperta
  const endpoint = API_ENDPOINTS.discover(mediaType);
  // Creo i parametri URL
  const urlParams = new URLSearchParams();

  // Aggiungo i parametri di filtro
  urlParams.append('vote_average.gte', String(filters.minRating));
  urlParams.append('vote_average.lte', String(filters.maxRating));

  // Aggiungo i filtri di genere
  if (filters.selectedGenres && filters.selectedGenres.length > 0) {
    urlParams.append('with_genres', filters.selectedGenres.join(','));
  }

  // Aggiungo i filtri di anno
  if (filters.releaseYearFrom) {
    urlParams.append(
      mediaType === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte',
      `${filters.releaseYearFrom}-01-01`
    );
  }

  // Aggiungo i filtri di anno
  if (filters.releaseYearTo) {
    urlParams.append(
      mediaType === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte',
      `${filters.releaseYearTo}-12-31`
    );
  }

  // Aggiungo i filtri di voto minimo
  if (filters.minVoteCount > 0) {
    urlParams.append('vote_count.gte', String(filters.minVoteCount));
  }

  // Eseguo la richiesta
  const data = await tmdbClient.get<TmdbPageResponse>(`${endpoint}?${urlParams.toString()}`);

  // Controllo se ci sono risultati
  if (data.results.length === 0) {
    throw new TmdbError('No results found with these filters', 404);
  }

  // Restituisco i risultati
  return {
    discoverUrl: `${endpoint}?${urlParams.toString()}`,
    totalPages: Math.min(data.total_pages, TMDB_MAX_PAGE),
  };
};

/**
 * Recupera una pagina di media
 * @param discoverUrl URL di scoperta
 * @param pageNumber Numero di pagina
 * @returns Pagina di media
 */
export const fetchMediaPage = async (
  discoverUrl: string,
  pageNumber: number
): Promise<TmdbPageResponse> => {
  return tmdbClient.get<TmdbPageResponse>(`${discoverUrl}&page=${pageNumber}`);
};

/**
 * Recupera i dettagli di un media
 * @param mediaType Tipo di media
 * @param mediaId ID del media
 * @returns Dettagli del media
 */
export const fetchMediaDetails = async (
  mediaType: MediaType,
  mediaId: number
): Promise<TmdbMedia> => {
  const endpoint = API_ENDPOINTS.details(mediaType, mediaId);
  return tmdbClient.get<TmdbMedia>(endpoint);
};

/**
 * Recupera i video di un media
 * @param mediaType Tipo di media
 * @param mediaId ID del media
 * @returns Video del media
 */
export const fetchMediaVideos = async (
  mediaType: MediaType,
  mediaId: number
): Promise<TmdbVideosResponse> => {
  const endpoint = API_ENDPOINTS.videos(mediaType, mediaId);
  const data = await tmdbClient.get<TmdbVideosResponse>(endpoint);

  if (!data.results || data.results.length === 0) {
    const responseEn = await tmdbClient.fetchRaw<TmdbVideosResponse>(
      `${endpoint}?api_key=${API_KEY}&language=en-US`
    );
    return responseEn;
  }

  return data;
};

let cachedGenres: Genre[] | null = null;
let cachedGenresPromise: Promise<Genre[]> | null = null;

/**
 * Recupera i generi
 * @returns Generi
 */
export const fetchGenres = async (): Promise<Genre[]> => {
  // Controllo se i generi sono già stati caricati
  if (cachedGenres) return cachedGenres;

  // Controllo se c'è già una promise in corso
  if (!cachedGenresPromise) {
    cachedGenresPromise = (async () => {
      try {
        // Recupero i generi per film e serie TV in parallelo
        const [movieData, tvData] = await Promise.all([
          tmdbClient.get<TmdbGenreListResponse>(API_ENDPOINTS.movieGenres),
          tmdbClient.get<TmdbGenreListResponse>(API_ENDPOINTS.tvGenres),
        ]);

        // Creo una mappa per memorizzare i generi unici
        const uniqueGenresMap = new Map<number, Genre>();

        // Aggiungo i generi dei film
        movieData.genres.forEach((genre: Genre) => {
          uniqueGenresMap.set(genre.id, genre);
        });

        tvData.genres.forEach((genre: Genre) => {
          // Se il genere non è già stato aggiunto, lo aggiungo
          if (!uniqueGenresMap.has(genre.id)) {
            uniqueGenresMap.set(genre.id, genre);
          }
        });

        // Ordino i generi per nome
        cachedGenres = Array.from(uniqueGenresMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        // Restituisco i generi
        return cachedGenres;
      } catch (error) {
        // Se c'è un errore, resetto la promise
        cachedGenresPromise = null;
        throw error;
      }
    })();
  }

  // Restituisco la promise
  return cachedGenresPromise;
};

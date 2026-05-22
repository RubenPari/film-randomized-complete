import {
  filterValidMedia,
  getRandomMedia,
  getRandomPage,
  hasValidDescription,
  isExcludedForCurrentType,
} from './mediaUtils.js';
import { MediaType, TmdbMedia, TmdbPageResponse } from '../types/index.js';

/**
 * Interfaccia per le opzioni di pickRandomValidMedia
 */
interface PickRandomValidMediaOptions {
  fetchPage: (page: number) => Promise<TmdbPageResponse>;
  fetchDetails: (mediaType: MediaType, id: number) => Promise<TmdbMedia>;
  totalPages: number;
  mediaType: MediaType;
  excludedItems?: Record<string, unknown>[];
  maxAttempts?: number;
}

/**
 * Seleziona un media casuale valido tra i candidati
 * @param fetchPage Funzione per recuperare una pagina di media
 * @param fetchDetails Funzione per recuperare i dettagli di un media
 * @param totalPages Numero totale di pagine
 * @param mediaType Tipo di media da recuperare
 * @param excludedItems Lista di media esclusi
 * @param maxAttempts Numero massimo di tentativi
 * @returns Media valido selezionato casualmente
 */
export async function pickRandomValidMedia({
  fetchPage,
  fetchDetails,
  totalPages,
  mediaType,
  excludedItems = [],
  maxAttempts = 5,
}: PickRandomValidMediaOptions): Promise<TmdbMedia> {
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
    const candidates = filterValidMedia(
      pageData?.results ?? [],
      excludedItems,
      mediaType,
    );

    if (candidates.length === 0) continue;

    // Selezione casuale di un candidato
    const candidate = getRandomMedia(candidates);
    // Recupero dei dettagli del candidato
    const details = await fetchDetails(mt, candidate.id);

    // Controllo se il candidato è valido
    if (
      hasValidDescription(details) &&
      !isExcludedForCurrentType(details.id, mt, excludedItems)
    ) {
      return details;
    }
  }

  throw new Error('No content found. Try modifying the filters.');
}

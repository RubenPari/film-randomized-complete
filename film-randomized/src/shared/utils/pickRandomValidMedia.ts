import {
  filterValidMedia,
  getRandomMedia,
  getRandomPage,
  hasValidDescription,
  isExcludedForCurrentType,
  resolveMediaTypeString,
} from './mediaUtils.js';
import { MediaType, TmdbMedia, TmdbPageResponse } from '../types/index.js';

interface PickRandomValidMediaOptions {
  fetchPage: (page: number) => Promise<TmdbPageResponse>;
  fetchDetails: (mediaType: MediaType, id: number) => Promise<TmdbMedia>;
  totalPages: number;
  mediaType: boolean | MediaType;
  excludedItems?: Record<string, unknown>[];
  maxAttempts?: number;
}

export async function pickRandomValidMedia({
  fetchPage,
  fetchDetails,
  totalPages,
  mediaType,
  excludedItems = [],
  maxAttempts = 5,
}: PickRandomValidMediaOptions): Promise<TmdbMedia> {
  const mt = resolveMediaTypeString(mediaType);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const page = getRandomPage(totalPages);
    const pageData = await fetchPage(page);
    const candidates = filterValidMedia(
      pageData?.results ?? [],
      excludedItems,
      mediaType,
    );

    if (candidates.length === 0) continue;

    const candidate = getRandomMedia(candidates);
    const details = await fetchDetails(mt, candidate.id);

    if (
      hasValidDescription(details) &&
      !isExcludedForCurrentType(details.id, mt, excludedItems)
    ) {
      return details;
    }
  }

  throw new Error('No content found. Try modifying the filters.');
}

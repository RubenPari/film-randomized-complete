/**
 * Provides media generator state to the home page tree without prop drilling.
 */
/* eslint-disable react-refresh/only-export-components -- provider and paired hooks belong together */
import React, { createContext, useContext } from 'react';
import { useMediaGenerator } from '../hooks/useMediaGenerator.js';

const FilterContext = createContext(null);

function useMediaGeneratorContext() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('Filter context must be used within FilterProvider');
  }
  return ctx;
}

/** Wraps useMediaGenerator once for all descendants. */
export function FilterProvider({ children }) {
  const value = useMediaGenerator();
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

/**
 * Filter panel state: filters, genres, and toggles (no fetch results).
 */
export function useFilterContext() {
  const v = useMediaGeneratorContext();
  return {
    mediaType: v.mediaType,
    setMediaType: v.setMediaType,
    minRating: v.minRating,
    maxRating: v.maxRating,
    setMinRating: v.setMinRating,
    setMaxRating: v.setMaxRating,
    releaseYearFrom: v.releaseYearFrom,
    releaseYearTo: v.releaseYearTo,
    setReleaseYearFrom: v.setReleaseYearFrom,
    setReleaseYearTo: v.setReleaseYearTo,
    minVoteCount: v.minVoteCount,
    setMinVoteCount: v.setMinVoteCount,
    genres: v.genres,
    selectedGenres: v.selectedGenres,
    handleGenreToggle: v.handleGenreToggle,
  };
}

/**
 * Generated media, loading/error, and session actions.
 */
export function useMediaResults() {
  const v = useMediaGeneratorContext();
  return {
    mediaType: v.mediaType,
    randomMedia: v.randomMedia,
    isLoading: v.isLoading,
    error: v.error,
    generateRandomMedia: v.generateRandomMedia,
    viewedMedia: v.viewedMedia,
    exportViewedMedia: v.exportViewedMedia,
    importViewedMedia: v.importViewedMedia,
  };
}

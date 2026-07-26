import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from './HomePage.jsx';
import { MIN_RELEASE_YEAR } from '../shared/constants/config.js';

const resetFilters = vi.fn();
const generateRandomMedia = vi.fn();
const submitMediaFeedback = vi.fn();

let filterContext = {
  mediaType: 'movie' as 'movie' | 'tv',
  setMediaType: vi.fn(),
  minRating: 0,
  maxRating: 10,
  setMinRating: vi.fn(),
  setMaxRating: vi.fn(),
  releaseYearFrom: MIN_RELEASE_YEAR,
  releaseYearTo: new Date().getFullYear(),
  setReleaseYearFrom: vi.fn(),
  setReleaseYearTo: vi.fn(),
  minVoteCount: 0,
  setMinVoteCount: vi.fn(),
  genres: [{ id: 28, name: 'Action' }],
  selectedGenres: [] as number[],
  handleGenreToggle: vi.fn(),
  resetFilters,
  isGenresLoading: false,
  genresError: null as string | null,
};

let resultsContext = {
  generatedMediaType: null as 'movie' | 'tv' | null,
  randomMedia: null as null | { id: number; title: string },
  recommendationExplanationKeys: [] as string[],
  currentMediaFeedbackValue: null,
  isLoading: false,
  isGenerating: false,
  isFilterPending: false,
  error: null as string | null,
  generateRandomMedia,
  submitMediaFeedback,
};

vi.mock('../features/media/context/FilterContext.jsx', () => ({
  useFilterContext: () => filterContext,
  useMediaResults: () => resultsContext,
}));

vi.mock('../features/media/components/MediaCard.jsx', () => ({
  default: ({ media, mediaType }: { media: { id: number }; mediaType: string }) => (
    <div>{`result-card-${mediaType}-${media.id}`}</div>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string | number>) =>
      options?.count !== undefined ? `${key}:${options.count}` : key,
    i18n: { resolvedLanguage: 'en' },
  }),
}));

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.removeAttribute('open');
    },
  });
});

beforeEach(() => {
  resetFilters.mockClear();
  generateRandomMedia.mockClear();
  filterContext = {
    ...filterContext,
    mediaType: 'movie',
    minRating: 0,
    maxRating: 10,
    releaseYearFrom: MIN_RELEASE_YEAR,
    releaseYearTo: new Date().getFullYear(),
    minVoteCount: 0,
    selectedGenres: [],
  };
  resultsContext = {
    ...resultsContext,
    generatedMediaType: null,
    randomMedia: null,
    isGenerating: false,
    error: null,
  };
});

describe('HomePage', () => {
  it('shows the first-run state and exactly one generate control', () => {
    render(<HomePage />);

    expect(screen.getByText('home.emptyTitle')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'home.generate' })).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'home.generate' }));
    expect(generateRandomMedia).toHaveBeenCalledTimes(1);
  });

  it('opens, resets, and closes the filter drawer with category-based count', () => {
    filterContext = {
      ...filterContext,
      mediaType: 'tv',
      minRating: 6.5,
      releaseYearFrom: 2000,
      minVoteCount: 10000,
      selectedGenres: [28, 12],
    };
    render(<HomePage />);

    expect(screen.getByLabelText('filters.activeCount:4')).toHaveTextContent('4');
    fireEvent.click(screen.getByRole('button', { name: 'filters.open' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('open');
    fireEvent.click(screen.getByRole('button', { name: 'filters.reset' }));
    expect(resetFilters).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'filters.close' }));
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it('renders loading, error, and generated-result states without a second CTA', () => {
    const view = render(<HomePage />);

    resultsContext = { ...resultsContext, isGenerating: true };
    view.rerender(<HomePage />);
    expect(screen.getByRole('status')).toHaveTextContent('home.generating');
    expect(screen.getAllByRole('button', { name: 'home.generating' })).toHaveLength(1);

    resultsContext = { ...resultsContext, isGenerating: false, error: 'generation failed' };
    view.rerender(<HomePage />);
    expect(screen.getByRole('alert')).toHaveTextContent('generation failed');

    resultsContext = {
      ...resultsContext,
      error: null,
      generatedMediaType: 'tv',
      randomMedia: { id: 42, title: 'Result' },
    };
    view.rerender(<HomePage />);
    expect(screen.getByText('result-card-tv-42').parentElement).toHaveClass('film-frame-enter');
    expect(screen.getAllByRole('button', { name: 'home.generateAgain' })).toHaveLength(1);
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import GenreFilter from './GenreFilter.jsx';
import MediaTypeSelector from './MediaTypeSelector.jsx';
import RatingFilter from './RatingFilter.jsx';
import VoteCountFilter from './VoteCountFilter.jsx';
import YearFilter from './YearFilter.jsx';
import { MIN_RELEASE_YEAR } from '../../../../shared/constants/config.js';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('filter controls', () => {
  it('clamps rating changes to the complementary bound', () => {
    const setMinRating = vi.fn();
    const setMaxRating = vi.fn();
    render(
      <RatingFilter
        minRating={5}
        maxRating={6}
        setMinRating={setMinRating}
        setMaxRating={setMaxRating}
      />
    );

    const sliders = screen.getAllByRole('slider');
    expect(sliders[0]).toHaveAccessibleName('filters.from');
    expect(sliders[1]).toHaveAccessibleName('filters.to');
    fireEvent.change(sliders[0], { target: { value: '9' } });
    fireEvent.change(sliders[1], { target: { value: '2' } });

    expect(setMinRating).toHaveBeenCalledWith(6);
    expect(setMaxRating).toHaveBeenCalledWith(5);
  });

  it('clamps year changes and exposes associated labels', () => {
    const setReleaseYearFrom = vi.fn();
    const setReleaseYearTo = vi.fn();
    render(
      <YearFilter
        releaseYearFrom={1990}
        releaseYearTo={2000}
        setReleaseYearFrom={setReleaseYearFrom}
        setReleaseYearTo={setReleaseYearTo}
      />
    );

    const from = screen.getByRole('spinbutton', { name: 'filters.from' });
    const to = screen.getByRole('spinbutton', { name: 'filters.to' });
    fireEvent.change(from, { target: { value: String(MIN_RELEASE_YEAR - 10) } });
    fireEvent.change(to, { target: { value: '1980' } });

    expect(setReleaseYearFrom).toHaveBeenCalledWith(MIN_RELEASE_YEAR);
    expect(setReleaseYearTo).toHaveBeenCalledWith(1990);
  });

  it('exposes selected state for media, vote, and genre controls', () => {
    const { rerender } = render(<MediaTypeSelector mediaType="tv" setMediaType={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'common.tvShows' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );

    rerender(<VoteCountFilter minVoteCount={10000} setMinVoteCount={vi.fn()} />);
    expect(screen.getByRole('button', { name: '10,000+' })).toHaveAttribute('aria-pressed', 'true');

    rerender(
      <GenreFilter
        genres={[{ id: 28, name: 'Action' }]}
        selectedGenres={[28]}
        handleGenreToggle={vi.fn()}
        isLoading={false}
        error={null}
      />
    );
    expect(screen.getByRole('checkbox', { name: 'Action' })).toBeChecked();
  });
});

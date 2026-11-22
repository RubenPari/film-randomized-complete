import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Link, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { FilterProvider, useFilterContext } from './FilterContext.jsx';

vi.mock('../hooks/useGenres.js', () => ({
  useGenres: () => ({ genres: [], error: null, isLoading: false }),
}));
vi.mock('../hooks/useMediaFetcher.js', () => ({
  useMediaFetcher: () => ({
    randomMedia: null,
    generatedMediaType: null,
    recommendationExplanationKeys: [],
    aiExplanation: null,
    cast: [],
    currentMediaFeedbackValue: null,
    isLoading: false,
    error: null,
    generateRandomMedia: vi.fn(),
    submitMediaFeedback: vi.fn(),
  }),
}));

function Home() {
  const { mediaType, setMediaType } = useFilterContext();
  return (
    <>
      <p>type:{mediaType}</p>
      <button onClick={() => setMediaType('tv')}>pick-tv</button>
      <Link to="/other">go</Link>
    </>
  );
}

describe('FilterProvider above routes', () => {
  it('keeps filters when navigating away and back', async () => {
    render(
      <MemoryRouter>
        <FilterProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/other" element={<Link to="/">back</Link>} />
          </Routes>
        </FilterProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('pick-tv'));
    expect(await screen.findByText('type:tv')).toBeTruthy();
    fireEvent.click(screen.getByText('go'));
    fireEvent.click(screen.getByText('back'));
    expect(await screen.findByText('type:tv')).toBeTruthy();
  });
});

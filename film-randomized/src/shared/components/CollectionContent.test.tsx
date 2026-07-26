import { Suspense } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CollectionContent from './CollectionContent.jsx';
import { NormalizableItem } from '../utils/normalizeMediaItem.js';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, string>) => (opts?.type ? `${key}:${opts.type}` : key),
  }),
}));

const COPY = {
  totalItemsKey: 'watchlist.totalItems',
  inListKey: 'watchlist.inList',
  emptyIcon: 'watchlist' as const,
  emptyTitleKeys: {
    all: 'watchlist.empty',
    movies: 'watchlist.emptyMovies',
    tv: 'watchlist.emptyTv',
  },
  emptyDescriptionAllKey: 'watchlist.emptyDescription',
  emptyDescriptionFilterKey: 'watchlist.emptyFilterDescription',
  ctaLabelKey: 'watchlist.discoverContent',
  singleItemLabelKey: 'watchlist.singleItem',
  multipleItemsLabelKey: 'watchlist.multipleItems',
  removeErrorKey: 'collections.removeError',
  dismissErrorKey: 'collections.dismissError',
};

const SAMPLE_ITEMS: NormalizableItem[] = [
  {
    id: 1,
    tmdb_id: 111,
    media_type: 'movie',
    title: 'The Matrix',
    poster_path: '/matrix.jpg',
    vote_average: 8.7,
    release_date: '1999-03-31',
    genres: JSON.stringify([{ id: 28, name: 'Action' }]),
  },
  {
    id: 2,
    tmdb_id: 222,
    media_type: 'tv',
    title: 'Breaking Bad',
    poster_path: '/bb.jpg',
    vote_average: 9.5,
    release_date: '2008-01-20',
    genres: JSON.stringify([{ id: 18, name: 'Drama' }]),
  },
];

interface ResolvedPromise<T> extends Promise<T> {
  status: string;
  value: T;
}

function resolvedPromise<T>(value: T): ResolvedPromise<T> {
  const p = Promise.resolve(value) as ResolvedPromise<T>;
  p.status = 'fulfilled';
  p.value = value;
  return p;
}

interface RenderCollectionProps {
  items?: NormalizableItem[];
  filter?: 'all' | 'movies' | 'tv';
  onRemove?: (item: NormalizableItem, token: string) => Promise<void>;
  onClearFilter?: () => void;
}

function renderCollection(props: RenderCollectionProps) {
  return render(
    <MemoryRouter>
      <Suspense fallback={<div>loading</div>}>
        <CollectionContent
          itemsPromise={resolvedPromise(props.items ?? SAMPLE_ITEMS)}
          filter={props.filter ?? 'all'}
          token="tkn"
          onRemove={props.onRemove ?? vi.fn().mockResolvedValue(undefined)}
          copy={COPY}
          onClearFilter={props.onClearFilter ?? vi.fn()}
        />
      </Suspense>
    </MemoryRouter>
  );
}

describe('CollectionContent', () => {
  it('renders the empty-state CTA when the list is empty', async () => {
    renderCollection({ items: [] });

    expect(await screen.findByText('watchlist.empty')).toBeInTheDocument();
    expect(screen.getByText('watchlist.discoverContent')).toBeInTheDocument();
  });

  it('clears a filtered empty state instead of linking home', async () => {
    const onClearFilter = vi.fn();
    renderCollection({ items: [], filter: 'movies', onClearFilter });

    fireEvent.click(await screen.findByRole('button', { name: 'collections.showAll' }));

    expect(onClearFilter).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('link', { name: 'watchlist.discoverContent' })
    ).not.toBeInTheDocument();
  });

  it('filters items by media type', async () => {
    renderCollection({ filter: 'movies' });

    expect(await screen.findByText('The Matrix')).toBeInTheDocument();
    expect(screen.queryByText('Breaking Bad')).not.toBeInTheDocument();
  });

  it('removes an item optimistically and reverts on API error', async () => {
    const onRemove = vi.fn().mockRejectedValue(new Error('network down'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    renderCollection({ onRemove });

    expect(await screen.findByText('The Matrix')).toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: 'media.remove: The Matrix' });
    fireEvent.click(removeButton);

    await waitFor(() => expect(onRemove).toHaveBeenCalledTimes(1));

    await waitFor(() => expect(screen.getByText('The Matrix')).toBeInTheDocument());
    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('collections.removeError');
    fireEvent.click(screen.getByRole('button', { name: 'collections.dismissError' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    errorSpy.mockRestore();
  });
});

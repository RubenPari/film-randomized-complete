import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider } from '../../../shared/components/Toast.jsx';
import SaveButtons from './SaveButtons.jsx';

const addToWatchlist = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock('../../../shared/context/AuthContext.jsx', () => ({
  useAuth: () => ({ token: 'tok' }),
}));
vi.mock('../../../shared/services/watchlistApi.js', () => ({
  addToWatchlist: (...args: unknown[]) => addToWatchlist(...args),
  checkInWatchlist: vi.fn().mockResolvedValue(false),
  removeFromWatchlist: vi.fn(),
}));

const renderButtons = () =>
  render(
    <MemoryRouter>
      <ToastProvider>
        <SaveButtons media={{ id: 1 } as never} mediaType="movie" />
      </ToastProvider>
    </MemoryRouter>
  );

describe('SaveButtons', () => {
  beforeEach(() => {
    addToWatchlist.mockReset();
  });

  it('shows a toast with a Watchlist link after saving', async () => {
    addToWatchlist.mockResolvedValue(undefined);
    renderButtons();

    fireEvent.click(screen.getByRole('button', { name: 'media.save' }));
    expect(await screen.findByRole('link', { name: 'common.watchlist' })).toHaveAttribute(
      'href',
      '/watchlist'
    );
  });

  it('shows a translated failure toast when saving fails', async () => {
    addToWatchlist.mockImplementation(async () => {
      throw new Error('boom');
    });
    renderButtons();

    fireEvent.click(screen.getByRole('button', { name: 'media.save' }));
    expect(await screen.findByText('media.saveError')).toBeInTheDocument();
  });
});

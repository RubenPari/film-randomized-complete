import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MainAppLayout from './MainAppLayout.jsx';

const logout = vi.fn();

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    user: { username: 'ruben', email: 'ruben@example.com' },
    logout,
    isAuthenticated: true,
    loading: false,
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('./LanguageSwitcher.jsx', () => ({
  default: () => <div>language-switcher</div>,
}));

const renderShell = () =>
  render(
    <MemoryRouter initialEntries={['/watchlist']}>
      <Routes>
        <Route element={<MainAppLayout />}>
          <Route path="/watchlist" element={<p>watchlist-page</p>} />
        </Route>
        <Route path="/login" element={<p>login-page</p>} />
      </Routes>
    </MemoryRouter>
  );

describe('MainAppLayout', () => {
  beforeEach(() => logout.mockClear());

  it('renders one shared destination set in desktop and mobile navigation', () => {
    renderShell();

    expect(
      [...document.querySelectorAll('nav a')].map((link) => link.getAttribute('href'))
    ).toEqual([
      '/',
      '/search',
      '/watchlist',
      '/discovered',
      '/profile',
      '/',
      '/search',
      '/watchlist',
      '/discovered',
      '/profile',
    ]);
    expect(screen.getAllByRole('link', { name: 'navigation.discover' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'navigation.search' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'common.watchlist' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'common.discovered' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'navigation.profile' })).toHaveLength(3);
    expect(
      screen
        .getAllByRole('link', { name: 'common.watchlist' })
        .every((link) => link.matches('[aria-current="page"]'))
    ).toBe(true);
  });

  it('logs out before navigating to login', () => {
    renderShell();

    fireEvent.click(screen.getByRole('button', { name: 'common.logout' }));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(screen.getByText('login-page')).toBeInTheDocument();
  });
});

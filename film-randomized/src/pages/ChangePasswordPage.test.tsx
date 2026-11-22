import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ChangePasswordPage from './ChangePasswordPage.jsx';

const logout = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock('../shared/context/AuthContext.jsx', () => ({
  useAuth: () => ({ user: { email: 'a@b.c' }, logout, changePassword: vi.fn() }),
}));
vi.mock('../shared/components/LanguageSwitcher.jsx', () => ({
  default: () => <div>language-switcher</div>,
}));

describe('ChangePasswordPage (Profile)', () => {
  beforeEach(() => {
    logout.mockClear();
  });

  it('offers language switch and logout, and logout goes to /login', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ChangePasswordPage />} />
          <Route path="/login" element={<p>login-page</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('language-switcher')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'common.logout' }));
    expect(logout).toHaveBeenCalledTimes(1);
    expect(screen.getByText('login-page')).toBeInTheDocument();
  });
});

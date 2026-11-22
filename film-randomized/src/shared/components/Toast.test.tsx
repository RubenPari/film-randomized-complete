import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from './Toast.jsx';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const Trigger = () => {
  const show = useToast();
  return (
    <button
      type="button"
      onClick={() => show({ message: 'saved', link: { to: '/watchlist', label: 'Watchlist' } })}
    >
      go
    </button>
  );
};

describe('Toast', () => {
  it('announces in a polite live region with a link, and can be dismissed', () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <Trigger />
        </ToastProvider>
      </MemoryRouter>
    );

    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    expect(region).toHaveTextContent('saved');
    expect(screen.getByRole('link', { name: 'Watchlist' })).toHaveAttribute('href', '/watchlist');
    fireEvent.click(screen.getByRole('button', { name: 'toast.dismiss' }));
    expect(region).toBeEmptyDOMElement();
  });
});

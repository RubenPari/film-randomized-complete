import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../../../shared/components/Toast.jsx';
import RecommendationFeedbackButtons from './RecommendationFeedbackButtons.jsx';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('RecommendationFeedbackButtons', () => {
  it('submits like and dislike immediately, then an optional dislike reason', () => {
    const onFeedback = vi.fn();
    render(<RecommendationFeedbackButtons currentValue={null} onFeedback={onFeedback} />);

    fireEvent.click(screen.getByRole('button', { name: 'recommendation.dislike' }));
    expect(onFeedback).toHaveBeenCalledWith('dislike');
    expect(
      screen.getByRole('button', { name: 'recommendation.reason.not_in_mood' })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'recommendation.reason.not_in_mood' }));
    expect(onFeedback).toHaveBeenCalledWith('dislike', 'not_in_mood');

    fireEvent.click(screen.getByRole('button', { name: 'recommendation.like' }));
    expect(onFeedback).toHaveBeenLastCalledWith('like');
  });

  it('marks only the top-level feedback choice as selected', () => {
    render(<RecommendationFeedbackButtons currentValue="dislike" onFeedback={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'recommendation.dislike' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(
      screen.getByRole('button', { name: 'recommendation.reason.wrong_genre' })
    ).not.toHaveAttribute('aria-pressed');
  });

  it('marks the chosen dislike reason as selected', () => {
    render(<RecommendationFeedbackButtons currentValue={null} onFeedback={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'recommendation.dislike' }));
    fireEvent.click(screen.getByRole('button', { name: 'recommendation.reason.too_long' }));
    expect(screen.getByRole('button', { name: 'recommendation.reason.too_long' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'recommendation.reason.too_slow' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('confirms the dislike with a toast on first tap', () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <RecommendationFeedbackButtons currentValue={null} onFeedback={vi.fn()} />
        </ToastProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'recommendation.dislike' }));
    expect(screen.getByRole('status')).toHaveTextContent('recommendation.dislikeToast');
  });
});

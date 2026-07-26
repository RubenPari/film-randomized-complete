import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RecommendationFeedbackButtons from './RecommendationFeedbackButtons.jsx';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('RecommendationFeedbackButtons', () => {
  it('submits like immediately but waits for a dislike reason', () => {
    const onFeedback = vi.fn();
    render(<RecommendationFeedbackButtons currentValue={null} onFeedback={onFeedback} />);

    fireEvent.click(screen.getByRole('button', { name: 'recommendation.dislike' }));
    expect(onFeedback).not.toHaveBeenCalled();
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
});

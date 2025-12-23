import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import ReviewsList from './ReviewsList';
import type { Review } from '../../types/review';

const reviewMock = vi.fn<(props: { review: Review }) => void>();

vi.mock('../Reviews/Review', () => ({
  default: (props: { review: Review }) => {
    reviewMock(props);
    return <li data-testid="review-item">{props.review.comment}</li>;
  },
}));

describe('ReviewsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders list of reviews', () => {
    const reviews = [
      { id: 'r1', comment: 'Good' } as unknown as Review,
      { id: 'r2', comment: 'Bad' } as unknown as Review,
    ];

    render(<ReviewsList reviews={reviews} />);

    expect(screen.getAllByTestId('review-item')).toHaveLength(2);
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Bad')).toBeInTheDocument();
    expect(reviewMock).toHaveBeenCalledTimes(2);
  });
});

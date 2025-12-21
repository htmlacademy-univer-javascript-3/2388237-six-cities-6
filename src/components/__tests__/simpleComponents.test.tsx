import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import Spinner from '../Spinner';
import FavoritesEmptyPage from '../FavoritesEmptyPage/FavoritesEmptyPage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Review from '../Reviews/Review';

describe('Simple components render', () => {
  it('Spinner renders', () => {
    render(<Spinner />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('FavoritesEmptyPage renders', () => {
    render(<FavoritesEmptyPage />);
    expect(screen.getByText(/Nothing yet saved/i)).toBeInTheDocument();
  });

  it('NotFoundPage renders', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  it('Review renders', () => {
    render(
      <Review
        review={{
          id: '1',
          comment: 'Nice place',
          date: '2020-01-01',
          rating: 4,
          user: {
            id: 1,
            name: 'John',
            avatarUrl: 'img.jpg',
            isPro: false,
          },
        }}
      />
    );

    expect(screen.getByText('Nice place')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});

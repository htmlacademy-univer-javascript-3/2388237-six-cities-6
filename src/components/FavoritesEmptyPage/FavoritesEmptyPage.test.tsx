import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import FavoritesEmptyPage from './FavoritesEmptyPage';

describe('FavoritesEmptyPage', () => {
  it('renders empty favorites content', () => {
    render(<FavoritesEmptyPage />);

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(
      screen.getByText('Save properties to narrow down search or plan your future trips.')
    ).toBeInTheDocument();

    expect(screen.getByText('Favorites (empty)')).toBeInTheDocument();

    expect(screen.getByText('Oliver.conner@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MainEmptyPage } from './MainEmptyPage';

describe('MainEmptyPage', () => {
  it('renders empty state text', () => {
    render(<MainEmptyPage />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(
      screen.getByText('We could not find any property available at the moment in Dusseldorf')
    ).toBeInTheDocument();
  });
});

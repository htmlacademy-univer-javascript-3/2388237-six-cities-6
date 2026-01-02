import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Spinner from './Spinner';

describe('Component: Spinner', () => {
  it('should render with default label', () => {
    render(<Spinner />);

    expect(screen.getByRole('img', { name: 'Loading...' })).toBeInTheDocument();
  });

  it('should render with custom label', () => {
    render(<Spinner label="Please wait" />);

    expect(screen.getByRole('img', { name: 'Please wait' })).toBeInTheDocument();
  });
});

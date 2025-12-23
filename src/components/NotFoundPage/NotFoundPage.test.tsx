import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import NotFoundPage from './NotFoundPage';

vi.mock('../Header/Header', () => ({
  default: () => <div data-testid="header-mock" />,
}));

describe('NotFoundPage', () => {
  it('renders 404 message and link to home', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('header-mock')).toBeInTheDocument();

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
    expect(screen.getByText('Извините, страница, которую вы ищете, не найдена.')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Вернуться на главную' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});

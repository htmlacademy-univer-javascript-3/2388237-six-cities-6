import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../pages/main/main', () => ({
  default: () => <div>MAIN_PAGE</div>,
}));

vi.mock('../../pages/login/login', () => ({
  default: () => <div>LOGIN_PAGE</div>,
}));

vi.mock('../../pages/favorites/favorites', () => ({
  default: () => <div>FAVORITES_PAGE</div>,
}));

vi.mock('../../pages/not-found/not-found', () => ({
  default: () => <div>NOT_FOUND_PAGE</div>,
}));

import App from '../App';

describe('App routing', () => {
  it('renders Main page on "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('MAIN_PAGE')).toBeInTheDocument();
  });

  it('renders Login page on "/login"', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('LOGIN_PAGE')).toBeInTheDocument();
  });

  it('renders NotFound page on unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('NOT_FOUND_PAGE')).toBeInTheDocument();
  });
});

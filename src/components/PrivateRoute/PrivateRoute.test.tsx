import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AuthorizationStatus } from '../../const';
import PrivateRoute from './PrivateRoute';

vi.mock('../../hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

vi.mock('../../store/selectors', () => ({
  selectAuthorizationStatus: vi.fn(),
}));

import { useAppSelector } from '../../hooks';

describe('Component: PrivateRoute', () => {
  it('should render children when user is authorized', () => {
    vi.mocked(useAppSelector).mockReturnValue(AuthorizationStatus.Auth);

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <div>Private page</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Private page')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });

  it('should redirect to /login when user is not authorized', () => {
    vi.mocked(useAppSelector).mockReturnValue(AuthorizationStatus.NoAuth);

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <div>Private page</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Private page')).not.toBeInTheDocument();
  });
});

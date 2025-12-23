import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FavoritesPage from './FavoritesPage';
import { AuthorizationStatus } from '../../const';

vi.mock('../Header/Header', () => ({
  default: () => null,
}));

type UnknownState = Record<string, unknown>;
type Selector<T> = (state: UnknownState) => T;

const mockDispatch = vi.fn<(action?: unknown) => unknown>();

vi.mock('../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: <T,>(selector: Selector<T>): T => selector({}),
}));

const mockSelectAuthorizationStatus = vi.fn<(state: UnknownState) => AuthorizationStatus>();
const mockSelectFavorites = vi.fn<(state: UnknownState) => unknown[]>();

vi.mock('../../store/selectors', () => ({
  selectAuthorizationStatus: (state: UnknownState) => mockSelectAuthorizationStatus(state),
  selectFavorites: (state: UnknownState) => mockSelectFavorites(state),
}));

const mockFetchFavoritesAction = vi.fn<() => { type: string }>(() => ({ type: 'offers/fetchFavorites' }));

vi.mock('../../store/slices/offers-slice', () => ({
  fetchFavoritesAction: () => mockFetchFavoritesAction(),
}));

const mockNavigate = vi.fn<(to: string) => void>();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Navigate: (props: { to: string }) => {
      mockNavigate(props.to);
      return null;
    },
  };
});

describe('FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /login when not authorized', () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.NoAuth);
    mockSelectFavorites.mockReturnValue([]);

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('dispatches fetchFavoritesAction on mount when authorized', () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.Auth);
    mockSelectFavorites.mockReturnValue([]);

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    expect(mockFetchFavoritesAction).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when favorites is empty', () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.Auth);
    mockSelectFavorites.mockReturnValue([]);

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
  });

  it('renders count when favorites is not empty', () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.Auth);
    mockSelectFavorites.mockReturnValue([{ id: '1' }, { id: '2' }]);

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Saved listing')).toBeInTheDocument();
  });
});

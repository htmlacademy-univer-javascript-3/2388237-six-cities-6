import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PlaceCard from './place-card';
import { AuthorizationStatus } from '../../const';
import type { Offer } from '../../types/offer';

type UnknownState = Record<string, unknown>;
type Selector<T> = (state: UnknownState) => T;

type ActionWithType = { type: string };
type ToggleReturn = { unwrap: () => Promise<void> };

const mockDispatch = vi.fn<(action: ActionWithType) => ActionWithType | ToggleReturn>();
const mockNavigate = vi.fn<(to: string) => void>();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: <T,>(selector: Selector<T>): T => selector({}),
}));

const mockSelectAuthorizationStatus = vi.fn<(state: UnknownState) => AuthorizationStatus>();

vi.mock('../../store/selectors', () => ({
  selectAuthorizationStatus: (state: UnknownState) => mockSelectAuthorizationStatus(state),
}));

const toggleFavoriteActionMock = vi.fn<(payload: { offerId: string; status: 0 | 1 }) => ActionWithType>(
  () => ({ type: 'offers/toggleFavorite' })
);

const fetchFavoritesActionMock = vi.fn<() => ActionWithType>(() => ({ type: 'offers/fetchFavorites' }));

vi.mock('../../store/slices/offers-slice', () => ({
  toggleFavoriteAction: (payload: { offerId: string; status: 0 | 1 }) => toggleFavoriteActionMock(payload),
  fetchFavoritesAction: () => fetchFavoritesActionMock(),
}));

describe('PlaceCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('navigates to /login if user is not authorized', async () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.NoAuth);

    render(<PlaceCard offer={{ id: '1', title: 'Place', isFavorite: false } as unknown as Offer} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('dispatches toggleFavoriteAction and then fetchFavoritesAction when authorized', async () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.Auth);

    const toggleReturn: ToggleReturn = { unwrap: () => Promise.resolve() };

    mockDispatch.mockImplementation((action: ActionWithType) => {
      if (action.type === 'offers/toggleFavorite') {
        return toggleReturn;
      }
      return action;
    });

    render(<PlaceCard offer={{ id: '10', title: 'Place', isFavorite: false } as unknown as Offer} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(toggleFavoriteActionMock).toHaveBeenCalledWith({ offerId: '10', status: 1 });

    await waitFor(() => {
      expect(fetchFavoritesActionMock).toHaveBeenCalledTimes(1);
    });
  });

  it('sends status 0 when offer is already favorite', async () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.Auth);

    const toggleReturn: ToggleReturn = { unwrap: () => Promise.resolve() };

    mockDispatch.mockImplementation((action: ActionWithType) => {
      if (action.type === 'offers/toggleFavorite') {
        return toggleReturn;
      }
      return action;
    });

    render(<PlaceCard offer={{ id: '11', title: 'Fav', isFavorite: true } as unknown as Offer} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(toggleFavoriteActionMock).toHaveBeenCalledWith({ offerId: '11', status: 0 });

    await waitFor(() => {
      expect(fetchFavoritesActionMock).toHaveBeenCalledTimes(1);
    });
  });
});

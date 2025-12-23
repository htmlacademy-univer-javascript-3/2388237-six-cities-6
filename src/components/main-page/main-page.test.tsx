import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import MainPage from './main-page';
import { AuthorizationStatus } from '../../const';

type UnknownState = Record<string, unknown>;
type Selector<T> = (state: UnknownState) => T;

const mockDispatch = vi.fn<(action?: unknown) => unknown>();

vi.mock('../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: <T,>(selector: Selector<T>): T => selector({}),
}));

const mockSelectAuthorizationStatus = vi.fn<(state: UnknownState) => AuthorizationStatus>();
const mockSelectUser = vi.fn<(state: UnknownState) => { email: string; avatarUrl?: string } | null>();
const mockSelectCity = vi.fn<(state: UnknownState) => string>();
const mockSelectIsOffersLoading = vi.fn<(state: UnknownState) => boolean>();
const mockSelectOffersError = vi.fn<(state: UnknownState) => boolean>();
const mockSelectFavoriteCount = vi.fn<(state: UnknownState) => number>();

type OfferStub = {
  id: string;
  title: string;
  city: { location: { latitude: number; longitude: number; zoom: number } };
  location: { latitude: number; longitude: number; zoom: number };
};

type SortedSelector = (state: UnknownState, sortType: string) => OfferStub[];
const mockMakeSelectSortedOffersByCity = vi.fn<() => SortedSelector>();

vi.mock('../../store/selectors', () => ({
  selectAuthorizationStatus: (state: UnknownState) => mockSelectAuthorizationStatus(state),
  selectUser: (state: UnknownState) => mockSelectUser(state),
  selectCity: (state: UnknownState) => mockSelectCity(state),
  selectIsOffersLoading: (state: UnknownState) => mockSelectIsOffersLoading(state),
  selectOffersError: (state: UnknownState) => mockSelectOffersError(state),
  selectFavoriteCount: (state: UnknownState) => mockSelectFavoriteCount(state),
  makeSelectSortedOffersByCity: () => mockMakeSelectSortedOffersByCity(),
}));

const mockChangeCity = vi.fn<(city: string) => { type: string; payload: string }>((city) => ({
  type: 'offers/changeCity',
  payload: city,
}));

const mockFetchFavorites = vi.fn<() => { type: string }>(() => ({
  type: 'offers/fetchFavorites',
}));

vi.mock('../../store/slices/offers-slice', () => ({
  changeCity: (city: string) => mockChangeCity(city),
  fetchFavoritesAction: () => mockFetchFavorites(),
}));

const mockRequireLogout = vi.fn<() => { type: string }>(() => ({ type: 'user/requireLogout' }));
const mockLogoutAction = vi.fn<() => { type: string }>(() => ({ type: 'user/logoutAction' }));

// ✅ ВАЖНО: добавили logoutAction в мок, чтобы Header не падал
vi.mock('../../store/slices/user-slice', () => ({
  requireLogout: () => mockRequireLogout(),
  logoutAction: () => mockLogoutAction(),
}));

const mockDropToken = vi.fn<() => void>(() => undefined);
vi.mock('../../services/token', () => ({
  dropToken: () => mockDropToken(),
}));

vi.mock('../cities-list/cities-list', () => ({
  default: (props: { cities: string[]; activeCity: string; onCityClick: (city: string) => void }) => (
    <div data-testid="cities-list">
      <button type="button" onClick={() => props.onCityClick(props.cities[0])}>
        city-click
      </button>
      <span>{props.activeCity}</span>
    </div>
  ),
}));

vi.mock('../Map/Map', () => ({
  default: () => <div data-testid="map">map</div>,
}));

vi.mock('../OfferList/OfferList', () => ({
  default: () => <div data-testid="offer-list">offer-list</div>,
}));

vi.mock('../SortOptions/SortOptions', () => ({
  default: (props: { onSortChange: (t: string) => void }) => (
    <button type="button" onClick={() => props.onSortChange('popular')}>
      sort
    </button>
  ),
}));

vi.mock('../Spinner', () => ({
  default: () => <div data-testid="spinner">spinner</div>,
}));

vi.mock('../MainEmptyPage/MainEmptyPage', () => ({
  MainEmptyPage: () => <div data-testid="main-empty">empty</div>,
}));

describe('MainPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.NoAuth);
    mockSelectUser.mockReturnValue(null);
    mockSelectCity.mockReturnValue('Paris');
    mockSelectIsOffersLoading.mockReturnValue(false);
    mockSelectOffersError.mockReturnValue(false);
    mockSelectFavoriteCount.mockReturnValue(0);

    mockMakeSelectSortedOffersByCity.mockImplementation(() => () => []);
  });

  it('renders Sign in link when not authorized', () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(mockFetchFavorites).not.toHaveBeenCalled();
  });

  it('dispatches fetchFavoritesAction on mount when authorized', () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.Auth);
    mockSelectUser.mockReturnValue({ email: 'user@test.ru', avatarUrl: '' });
    mockSelectFavoriteCount.mockReturnValue(5);

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    expect(mockFetchFavorites).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('user@test.ru')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('shows Spinner when loading', () => {
    mockSelectIsOffersLoading.mockReturnValue(true);

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows error text when error=true', () => {
    mockSelectOffersError.mockReturnValue(true);

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Не удалось загрузить предложения. Попробуйте обновить страницу.')
    ).toBeInTheDocument();
  });

  it('renders empty page when offers empty and not loading and no error', () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('main-empty')).toBeInTheDocument();
  });

  it('renders offers section when offers exist', () => {
    const offers: OfferStub[] = [
      {
        id: '1',
        title: 'Offer 1',
        city: { location: { latitude: 10, longitude: 20, zoom: 12 } },
        location: { latitude: 10, longitude: 20, zoom: 12 },
      },
    ];

    mockMakeSelectSortedOffersByCity.mockImplementation(() => () => offers);

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    expect(screen.getByText('1 places to stay in Paris')).toBeInTheDocument();
    expect(screen.getByTestId('offer-list')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('dispatches changeCity on city click', async () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    await userEvent.setup().click(screen.getByText('city-click'));

    expect(mockChangeCity).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'offers/changeCity',
      })
    );
  });

  it('logout drops token and dispatches requireLogout', async () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.Auth);
    mockSelectUser.mockReturnValue({ email: 'user@test.ru', avatarUrl: '' });

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    await userEvent.setup().click(screen.getByText('Sign out'));

    expect(mockDropToken).toHaveBeenCalledTimes(1);
    expect(mockRequireLogout).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'user/requireLogout' });

    expect(mockLogoutAction).toHaveBeenCalledTimes(1);
  });
});

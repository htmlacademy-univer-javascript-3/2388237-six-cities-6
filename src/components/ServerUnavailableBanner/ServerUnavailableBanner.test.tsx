import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import ServerUnavailableBanner from './ServerUnavailableBanner';

type UnknownState = Record<string, unknown>;
type Selector<T> = (state: UnknownState) => T;

const mockUseAppSelector = vi.fn();

vi.mock('../../hooks', () => ({
  useAppSelector: <T,>(selector: Selector<T>): T => {
    const result = mockUseAppSelector(selector) as T;
    return result;
  },
}));

const mockSelectOffersError = vi.fn<() => string | null>();
const mockSelectFavoritesError = vi.fn<() => string | null>();
const mockSelectOfferPageError = vi.fn<() => string | null>();

vi.mock('../../store/selectors', () => ({
  selectOffersError: (): string | null => mockSelectOffersError(),
  selectFavoritesError: (): string | null => mockSelectFavoritesError(),
  selectOfferPageError: (): string | null => mockSelectOfferPageError(),
}));

describe('ServerUnavailableBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSelectOffersError.mockReturnValue(null);
    mockSelectFavoritesError.mockReturnValue(null);
    mockSelectOfferPageError.mockReturnValue(null);

    mockUseAppSelector.mockImplementation(<T,>(selector: Selector<T>): T => selector({}));
  });

  it('does not render when there is no network-like error', () => {
    render(<ServerUnavailableBanner />);

    expect(screen.queryByRole('alert')).toBeNull();
    expect(
      screen.queryByText('Сервер недоступен. Проверьте подключение к интернету и попробуйте ещё раз.')
    ).toBeNull();
  });

  it('renders banner when error looks like network error', () => {
    mockSelectOffersError.mockReturnValue('Network Error');

    render(<ServerUnavailableBanner />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText('Сервер недоступен. Проверьте подключение к интернету и попробуйте ещё раз.')
    ).toBeInTheDocument();
  });
});

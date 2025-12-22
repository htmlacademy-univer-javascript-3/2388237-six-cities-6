import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AuthorizationStatus } from '../../const';
import type { Offer } from '../../types/offer';
import OfferCard from '../OfferCard/OfferCard';

type Selector = (state: unknown) => unknown;

const dispatchMock = vi.fn<(action: unknown) => unknown>();
const navigateMock = vi.fn<(to: string) => void>();
const useAppSelectorMock = vi.fn<(selector: Selector) => unknown>();

vi.mock('../../hooks', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: Selector) => useAppSelectorMock(selector),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../../store/selectors', () => ({
  selectAuthorizationStatus: vi.fn(),
}));

describe('Component: OfferCard', () => {
  const baseOffer: Offer = {
    id: '1',
    title: 'Nice place',
    type: 'apartment',
    price: 100,
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    isFavorite: false,
    isPremium: false,
    rating: 4.2,
    previewImage: 'img.jpg',
    images: [],
    bedrooms: 1,
    maxAdults: 2,
    goods: [],
    host: {
      id: 1,
      name: 'Host',
      avatarUrl: 'avatar.jpg',
      isPro: true,
    },
    description: 'desc',
  };

  it('should call onHover with offer id on mouse enter and null on mouse leave', async () => {
    const user = userEvent.setup();
    const onHover = vi.fn<(id: string | null) => void>();

    useAppSelectorMock.mockReturnValue(AuthorizationStatus.NoAuth);

    render(
      <MemoryRouter>
        <OfferCard offer={baseOffer} onHover={onHover} />
      </MemoryRouter>
    );

    const card = screen.getByRole('article');

    await user.hover(card);
    expect(onHover).toHaveBeenCalledWith('1');

    await user.unhover(card);
    expect(onHover).toHaveBeenCalledWith(null);
  });

  it('should navigate to /login when user is not authorized and clicks bookmark', async () => {
    const user = userEvent.setup();

    useAppSelectorMock.mockReturnValue(AuthorizationStatus.NoAuth);
    dispatchMock.mockReset();
    navigateMock.mockReset();

    render(
      <MemoryRouter>
        <OfferCard offer={baseOffer} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /to bookmarks/i }));

    expect(navigateMock).toHaveBeenCalledWith('/login');
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('should dispatch when user is authorized and clicks bookmark', async () => {
    const user = userEvent.setup();

    useAppSelectorMock.mockReturnValue(AuthorizationStatus.Auth);
    navigateMock.mockReset();
    dispatchMock.mockReset();

    const unwrapMock = vi.fn().mockResolvedValue(undefined);
    dispatchMock.mockImplementation(() => ({ unwrap: unwrapMock }));

    render(
      <MemoryRouter>
        <OfferCard offer={baseOffer} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /to bookmarks/i }));

    expect(navigateMock).not.toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalled();
    expect(unwrapMock).toHaveBeenCalled();
  });
});

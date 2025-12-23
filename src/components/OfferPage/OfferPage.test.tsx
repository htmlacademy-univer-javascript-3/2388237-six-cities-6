import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import OfferPage from './OfferPage';

vi.mock('../Header/Header', () => ({
  default: () => null,
}));

vi.mock('../Map/Map', () => ({
  default: () => null,
}));
import { AuthorizationStatus } from '../../const';
import type { Offer } from '../../types/offer';
import type { Review } from '../../types/review';

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

vi.mock('../Map/Map', () => ({
  default: () => <div data-testid="map-mock" />,
}));

vi.mock('../Reviews/ReviewForm', () => ({
  default: () => <div data-testid="review-form-mock" />,
}));

vi.mock('../../store/selectors', () => ({
  selectAuthorizationStatus: vi.fn(),
  selectOfferPageOffer: vi.fn(),
  selectOfferPageNearby: vi.fn(),
  selectOfferPageReviews: vi.fn(),
  selectOfferPageLoading: vi.fn(),
  selectOfferPageNotFound: vi.fn(),
}));

describe('Page: OfferPage', () => {
  const offer: Offer = {
    id: '1',
    title: 'Offer title',
    type: 'apartment',
    price: 120,
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    isFavorite: false,
    isPremium: true,
    rating: 4.3,
    images: ['1.jpg', '2.jpg'],
    previewImage: 'prev.jpg',
    bedrooms: 2,
    maxAdults: 3,
    goods: ['Wi-Fi'],
    host: { id: 1, name: 'Host', avatarUrl: 'a.jpg', isPro: true },
    description: 'Desc',
  };

  const reviews: Review[] = [
    {
      id: 'r1',
      date: '2020-01-01T10:00:00.000Z',
      user: { id: 2, name: 'Ann', avatarUrl: 'a.jpg', isPro: true },
      comment: 'Good',
      rating: 4,
    },
  ];

  it('should show loading when page is loading', () => {
    useAppSelectorMock
      .mockReturnValueOnce(offer) // offer
      .mockReturnValueOnce([]) // nearby
      .mockReturnValueOnce(reviews) // reviews
      .mockReturnValueOnce(true) // isLoading
      .mockReturnValueOnce(false) // notFound
      .mockReturnValueOnce(AuthorizationStatus.Auth); // auth

    render(
      <MemoryRouter initialEntries={['/offer/1']}>
        <Routes>
          <Route path="/offer/:id" element={<OfferPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should redirect to /404 when notFound=true', () => {
    useAppSelectorMock
      .mockReturnValueOnce(null) // offer
      .mockReturnValueOnce([]) // nearby
      .mockReturnValueOnce([]) // reviews
      .mockReturnValueOnce(false) // isLoading
      .mockReturnValueOnce(true) // notFound
      .mockReturnValueOnce(AuthorizationStatus.Auth); // auth

    render(
      <MemoryRouter initialEntries={['/offer/1']}>
        <Routes>
          <Route path="/offer/:id" element={<OfferPage />} />
          <Route path="/404" element={<div>Not Found Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Not Found Page')).toBeInTheDocument();
  });

  it('should navigate to /login when user is not authorized and clicks bookmark', async () => {
    const user = userEvent.setup();
    navigateMock.mockReset();

    useAppSelectorMock
      .mockReturnValueOnce(offer) // offer
      .mockReturnValueOnce([]) // nearby
      .mockReturnValueOnce(reviews) // reviews
      .mockReturnValueOnce(false) // isLoading
      .mockReturnValueOnce(false) // notFound
      .mockReturnValueOnce(AuthorizationStatus.NoAuth); // auth

    render(
      <MemoryRouter initialEntries={['/offer/1']}>
        <Routes>
          <Route path="/offer/:id" element={<OfferPage />} />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /to bookmarks/i }));
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  it('should render map mock and offer title when loaded', () => {
    useAppSelectorMock
      .mockReturnValueOnce(offer) // offer
      .mockReturnValueOnce([]) // nearby
      .mockReturnValueOnce(reviews) // reviews
      .mockReturnValueOnce(false) // isLoading
      .mockReturnValueOnce(false) // notFound
      .mockReturnValueOnce(AuthorizationStatus.Auth); // auth

    render(
      <MemoryRouter initialEntries={['/offer/1']}>
        <Routes>
          <Route path="/offer/:id" element={<OfferPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Offer title')).toBeInTheDocument();
    expect(screen.getByTestId('map-mock')).toBeInTheDocument();
  });
});

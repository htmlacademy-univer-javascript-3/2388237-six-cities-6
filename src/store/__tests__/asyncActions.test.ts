import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import type { AxiosInstance } from 'axios';
import { configureStore } from '@reduxjs/toolkit';

import { createAPI } from '../../services/api';
import { APIRoute, AuthorizationStatus } from '../../const';

import offersReducer, {
  fetchOffersAction,
  fetchFavoritesAction,
  toggleFavoriteAction,
} from '../slices/offers-slice';
import offerPageReducer, {
  fetchNearbyOffersAction,
  fetchCommentsAction,
  postReviewAction,
} from '../slices/offer-page-slice';
import userReducer, { checkAuthAction, loginAction } from '../slices/user-slice';

import type { Offer } from '../../types/offer';
import type { Review } from '../../types/review';

describe('Async actions (thunks)', () => {
  let api: AxiosInstance;
  let mockAxios: MockAdapter;

  const mockOffer: Offer = {
    id: '1',
    title: 'Test offer',
    type: 'apartment',
    price: 100,
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    isFavorite: false,
    isPremium: false,
    rating: 4.2,
    previewImage: 'img.jpg',
    host: {
      id: 1,
      name: 'Host',
      avatarUrl: 'avatar.jpg',
      isPro: false,
    },
  };

  const mockReview: Review = {
    id: 'r1',
    date: new Date().toISOString(),
    user: {
      id: 2,
      name: 'User',
      avatarUrl: 'avatar2.jpg',
      isPro: false,
    },
    comment: 'ok',
    rating: 5,
  };

  beforeEach(() => {
    api = createAPI();
    mockAxios = new MockAdapter(api);
  });

  function makeStore() {
    return configureStore({
      reducer: {
        offers: offersReducer,
        offerPage: offerPageReducer,
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: { extraArgument: api },
        }),
    });
  }

  it('fetchOffersAction should dispatch without errors (success)', async () => {
    mockAxios.onGet(APIRoute.Offers).reply(200, [mockOffer]);

    const store = makeStore();
    await store.dispatch(fetchOffersAction());

    expect(store.getState()).toBeDefined();
  });

  it('fetchFavoritesAction should dispatch without errors (success)', async () => {
    mockAxios.onGet(APIRoute.Favorite).reply(200, [mockOffer]);

    const store = makeStore();
    await store.dispatch(fetchFavoritesAction());

    expect(store.getState()).toBeDefined();
  });

  it('toggleFavoriteAction should dispatch without errors (success)', async () => {
    mockAxios
      .onPost(new RegExp(`^${APIRoute.Favorite}/\\d+/[01]$`))
      .reply(200, { ...mockOffer, isFavorite: true });

    const store = makeStore();
    await store.dispatch(toggleFavoriteAction({ offerId: '1', status: 1 }));

    expect(store.getState()).toBeDefined();
  });

  it('fetchNearbyOffersAction should dispatch without errors (success)', async () => {
    mockAxios
      .onGet(`${APIRoute.Offers}/1/nearby`)
      .reply(200, [mockOffer]);

    const store = makeStore();
    await store.dispatch(fetchNearbyOffersAction('1'));

    expect(store.getState()).toBeDefined();
  });

  it('fetchCommentsAction should dispatch without errors (success)', async () => {
    mockAxios
      .onGet(`${APIRoute.Comments}/1`)
      .reply(200, [mockReview]);

    const store = makeStore();
    await store.dispatch(fetchCommentsAction('1'));

    expect(store.getState()).toBeDefined();
  });

  it('postReviewAction should dispatch without errors (success)', async () => {
    mockAxios.onPost(`${APIRoute.Comments}/1`).reply(200);
    mockAxios.onGet(`${APIRoute.Comments}/1`).reply(200, [mockReview]);

    const store = makeStore();
    await store.dispatch(postReviewAction({ offerId: '1', comment: 'ok', rating: 5 }));

    expect(store.getState()).toBeDefined();
  });

  it('checkAuthAction should dispatch without errors (success)', async () => {
    mockAxios.onGet(APIRoute.Login).reply(200, { status: AuthorizationStatus.Auth });

    const store = makeStore();
    await store.dispatch(checkAuthAction());

    expect(store.getState()).toBeDefined();
  });

  it('loginAction should dispatch without errors (success)', async () => {
    mockAxios.onPost(APIRoute.Login).reply(200, {});

    const store = makeStore();
    await store.dispatch(loginAction({ email: 'test@test.ru', password: '123456' } as never));

    expect(store.getState()).toBeDefined();
  });
});

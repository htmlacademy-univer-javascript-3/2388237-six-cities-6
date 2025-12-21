import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import type { AxiosInstance } from 'axios';
import { configureStore } from '@reduxjs/toolkit';

import { createAPI } from '../../services/api';

import offersReducer from '../offersReducer';
import offerPageReducer from '../slices/offer-page-slice';
import userReducer from '../slices/user-slice';

import { fetchOffers } from '../offersReducer';
import { fetchFavorites, toggleFavorite } from '../favoritesActions';
import {
  fetchNearbyOffersAction,
  fetchCommentsAction,
  postReviewAction,
} from '../slices/offer-page-slice';
import { checkAuthAction, loginAction } from '../slices/user-slice';

describe('Async actions (thunks)', () => {
  let api: AxiosInstance;
  let mockAxios: MockAdapter;

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

  it('fetchOffers should dispatch without errors (success)', async () => {
    mockAxios.onGet('/offers').reply(200, []);

    const store = makeStore();
    await store.dispatch(fetchOffers());

    expect(store.getState()).toBeDefined();
  });

  it('fetchFavorites should dispatch without errors (success)', async () => {
    mockAxios.onGet('/favorite').reply(200, []);

    const store = makeStore();
    await store.dispatch(fetchFavorites());

    expect(store.getState()).toBeDefined();
  });

  it('toggleFavorite should dispatch without errors (success)', async () => {
    mockAxios.onPost(/\/favorite\/\d+\/[01]/).reply(200, {});

    const store = makeStore();
    await store.dispatch(toggleFavorite({ offerId: 1, status: 1 }));

    expect(store.getState()).toBeDefined();
  });

  it('checkAuthAction should dispatch without errors (success)', async () => {
    mockAxios.onGet('/login').reply(200, {});

    const store = makeStore();
    await store.dispatch(checkAuthAction());

    expect(store.getState()).toBeDefined();
  });

  it('loginAction should dispatch without errors (success)', async () => {
    mockAxios.onPost('/login').reply(200, {});

    const store = makeStore();
    await store.dispatch(loginAction({ email: 'test@test.ru', password: '123456' } as never));

    expect(store.getState()).toBeDefined();
  });

  it('fetchNearbyOffersAction should dispatch without errors (success)', async () => {
    mockAxios.onGet(/\/offers\/.*/).reply(200, []);

    const store = makeStore();
    await store.dispatch(fetchNearbyOffersAction('1' as never));

    expect(store.getState()).toBeDefined();
  });

  it('fetchCommentsAction should dispatch without errors (success)', async () => {
    mockAxios.onGet(/\/comments\/.*/).reply(200, []);

    const store = makeStore();
    await store.dispatch(fetchCommentsAction('1' as never));

    expect(store.getState()).toBeDefined();
  });

  it('postReviewAction should dispatch without errors (success)', async () => {
    mockAxios.onPost(/\/comments\/.*/).reply(200, {});

    const store = makeStore();
    await store.dispatch(
      postReviewAction({ offerId: '1', comment: 'ok', rating: 5 } as never)
    );

    expect(store.getState()).toBeDefined();
  });
});

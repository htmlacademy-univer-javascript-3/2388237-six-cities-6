import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

import type { Offer } from '../types/offer';
import type { UserData } from '../types/user';
import type { Review } from '../types/review';
import { AuthorizationStatus, SortType } from '../const';

export const selectCity = (state: RootState) => state.offers.city;

export const selectOffers = (state: RootState): Offer[] => state.offers.offers;

export const selectIsOffersLoading = (state: RootState): boolean => state.offers.isOffersLoading;

export const selectOffersError = (state: RootState): string | null => state.offers.offersError;

export const selectFavoritesError = (state: RootState): string | null => state.offers.favoritesError;

export const selectOffersByCity = createSelector([selectOffers, selectCity], (offers, city) =>
  offers.filter((offer) => offer.city.name === city)
);

export const makeSelectSortedOffersByCity = () =>
  createSelector([selectOffersByCity, (_state: RootState, sortType: SortType) => sortType], (offers, sortType) => {
    // Popular = как пришло с сервера (без сортировки)
    if (sortType === SortType.Popular) {
      return offers;
    }

    const sortedOffers = offers.slice();

    switch (sortType) {
      case SortType.PriceLowToHigh:
        sortedOffers.sort((a, b) => a.price - b.price);
        break;
      case SortType.PriceHighToLow:
        sortedOffers.sort((a, b) => b.price - a.price);
        break;
      case SortType.TopRated:
        sortedOffers.sort((a, b) => b.rating - a.rating);
        break;
    }

    return sortedOffers;
  });

export const makeSelectOfferById = () =>
  createSelector([selectOffers, (_state: RootState, id: string) => id], (offers, id) => offers.find((o) => o.id === id) ?? null);

export const selectFavorites = (state: RootState): Offer[] => state.offers.favorites;

export const selectFavoriteCount = (state: RootState): number => state.offers.favorites.length;

export const selectAuthorizationStatus = (state: RootState): AuthorizationStatus => state.user.authorizationStatus;

export const selectUser = (state: RootState): UserData | null => state.user.user;

export const selectOfferPageOffer = (state: RootState): Offer | null => state.offerPage.offer;

export const selectOfferPageNearby = (state: RootState): Offer[] => state.offerPage.nearby;

export const selectOfferPageReviews = (state: RootState): Review[] => state.offerPage.reviews;

export const selectOfferPageLoading = (state: RootState): boolean => state.offerPage.isLoading;

export const selectOfferPagePosting = (state: RootState): boolean => state.offerPage.isPosting;

export const selectOfferPageNotFound = (state: RootState): boolean => state.offerPage.notFound;

export const selectOfferPageError = (state: RootState): string | null => state.offerPage.error;

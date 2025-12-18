import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Offer } from '../types/offer';
import type { UserData } from '../types/user';
import { AuthorizationStatus } from '../const';
import type { Review } from '../types/review';
import type { SortType } from '../components/SortOptions/SortOptions';

export const selectCity = (state: RootState) => state.offers.city;
export const selectOffers = (state: RootState): Offer[] => state.offers.offers;
export const selectIsOffersLoading = (state: RootState) => state.offers.isOffersLoading;
export const selectOffersError = (state: RootState) => state.offers.offersError;

export const selectOffersByCity = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city)
);

export const makeSelectSortedOffersByCity = () =>
  createSelector(
    [selectOffersByCity, (_state: RootState, sortType: SortType) => sortType],
    (offers, sortType) => {
      const result = offers.slice();

      switch (sortType) {
        case 'priceLowToHigh':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'priceHighToLow':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'topRated':
          result.sort((a, b) => b.rating - a.rating);
          break;
      }

      return result;
    }
  );

export const makeSelectOfferById = () =>
  createSelector(
    [selectOffers, (_state: RootState, id: string) => id],
    (offers, id) => offers.find((offer) => offer.id === id)
  );

export const selectAuthorizationStatus = (state: RootState): AuthorizationStatus =>
  state.user.authorizationStatus;

export const selectUser = (state: RootState): UserData | null => state.user.user;

export const selectOfferPageOffer = (state: RootState): Offer | null => state.offerPage.offer;
export const selectOfferPageNearby = (state: RootState): Offer[] => state.offerPage.nearby;
export const selectOfferPageReviews = (state: RootState): Review[] => state.offerPage.reviews;
export const selectOfferPageLoading = (state: RootState): boolean => state.offerPage.isLoading;
export const selectOfferPagePosting = (state: RootState): boolean => state.offerPage.isPosting;
export const selectOfferPageNotFound = (state: RootState): boolean => state.offerPage.notFound;
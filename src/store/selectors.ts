import type { RootState } from './index';
import type { Offer } from '../types/offer';
import type { UserData } from '../types/user';
import { AuthorizationStatus } from '../const';
import type { Review } from '../types/review';

export const selectCity = (state: RootState) => state.offers.city;
export const selectOffers = (state: RootState): Offer[] => state.offers.offers;
export const selectIsOffersLoading = (state: RootState) => state.offers.isOffersLoading;
export const selectOffersError = (state: RootState) => state.offers.offersError;

export const selectOffersByCity = (state: RootState): Offer[] => {
  const city = selectCity(state);
  return selectOffers(state).filter((offer) => offer.city.name === city);
};

export const selectOfferById = (state: RootState, id: string): Offer | undefined =>
  selectOffers(state).find((offer) => offer.id === id);

export const selectAuthorizationStatus = (state: RootState): AuthorizationStatus =>
  state.user.authorizationStatus;

export const selectUser = (state: RootState): UserData | null => state.user.user;

export const selectOfferPageOffer = (state: RootState): Offer | null => state.offerPage.offer;
export const selectOfferPageNearby = (state: RootState): Offer[] => state.offerPage.nearby;
export const selectOfferPageReviews = (state: RootState): Review[] => state.offerPage.reviews;
export const selectOfferPageLoading = (state: RootState): boolean => state.offerPage.isLoading;
export const selectOfferPagePosting = (state: RootState): boolean => state.offerPage.isPosting;
export const selectOfferPageNotFound = (state: RootState): boolean => state.offerPage.notFound;

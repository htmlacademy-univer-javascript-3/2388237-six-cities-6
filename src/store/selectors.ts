import { RootState } from './root-reducer';
import { Offer } from '../types/offer';

export const selectCity = (state: RootState) => state.offers.city;
export const selectOffers = (state: RootState): Offer[] => state.offers.offers;
export const selectIsOffersLoading = (state: RootState) => state.offers.isOffersLoading;
export const selectOffersError = (state: RootState) => state.offers.offersError;

export const selectOffersByCity = (state: RootState): Offer[] => {
  const city = selectCity(state);
  return selectOffers(state).filter((offer) => offer.city.name === city);
};

export const selectOfferById = (state: RootState, id: number): Offer | undefined =>
  selectOffers(state).find((offer) => offer.id === id);

import { AuthorizationStatus } from '../const';
import { UserData } from '../types/user';

export const selectAuthorizationStatus = (state: RootState): AuthorizationStatus =>
  state.user.authorizationStatus;

export const selectUser = (state: RootState): UserData | null => state.user.user;

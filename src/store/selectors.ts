import { Offer } from '../mocks/offers';
import { RootState } from './index';

export const getCity = (state: RootState): string => state.city;

export const getOffers = (state: RootState): Offer[] => state.offers;

export const getOffersByCity = (state: RootState): Offer[] =>
  state.city === 'All'
    ? state.offers
    : state.offers.filter((offer) => offer.city === state.city);

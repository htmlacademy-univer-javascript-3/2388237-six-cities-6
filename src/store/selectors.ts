import { State } from './reducer';
import { Offer } from '../mocks/offers';

export const getCity = (state: State): string => state.city;

export const getOffers = (state: State): Offer[] => state.offers;

export const getOffersByCity = (state: State): Offer[] =>
  state.offers.filter((offer) => offer.city === state.city);

import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { Offer } from '../mocks/offers';
import { changeCity, loadOffers } from './action';

export type State = {
  city: string;
  offers: Offer[];
};

const initialState: State = {
  city: 'Paris',
  offers: [],
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    })
    .addCase(loadOffers, (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    });
});

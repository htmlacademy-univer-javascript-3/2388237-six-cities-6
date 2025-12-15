import { createAction } from '@reduxjs/toolkit';
import { Offer } from '../mocks/offers';

export const changeCity = createAction<string>('changeCity');
export const loadOffers = createAction<Offer[]>('loadOffers');

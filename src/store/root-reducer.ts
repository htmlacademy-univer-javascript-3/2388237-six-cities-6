import { combineReducers } from '@reduxjs/toolkit';
import offersReducer from './slices/offers-slice';
import userReducer from './slices/user-slice';
import offerPageReducer from './slices/offer-page-slice';

export const rootReducer = combineReducers({
  offers: offersReducer,
  user: userReducer,
  offerPage: offerPageReducer,
});

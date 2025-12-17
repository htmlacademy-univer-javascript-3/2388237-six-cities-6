import { combineReducers } from '@reduxjs/toolkit';
import offersReducer from './slices/offers-slice';

export const rootReducer = combineReducers({
  offers: offersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

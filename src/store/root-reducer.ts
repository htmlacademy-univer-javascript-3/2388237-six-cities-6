import { combineReducers } from '@reduxjs/toolkit';
import offersReducer from './slices/offers-slice';
import userReducer from './slices/user-slice';

export const rootReducer = combineReducers({
  offers: offersReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

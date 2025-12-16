import { combineReducers } from '@reduxjs/toolkit';
import offersReducer from './offersReducer';

export const rootReducer = combineReducers({
  offersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

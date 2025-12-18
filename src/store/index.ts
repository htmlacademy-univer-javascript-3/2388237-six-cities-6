import { configureStore } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';

import { createAPI } from '../services/api';
import { rootReducer } from './root-reducer';

export const api: AxiosInstance = createAPI();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: { extraArgument: api },
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

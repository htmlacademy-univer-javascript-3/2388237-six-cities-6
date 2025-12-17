import { configureStore } from '@reduxjs/toolkit';
import axios, { AxiosInstance } from 'axios';
import { rootReducer } from './root-reducer';

const API_URL = 'https://14.design.htmlacademy.pro/six-cities';
const TIMEOUT = 5000;

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
});

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

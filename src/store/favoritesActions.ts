import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';
import type { Offer } from '../types';

export const fetchFavorites = createAsyncThunk<Offer[], undefined, { extra: AxiosInstance }>(
  'favorites/fetchFavorites',
  async (_, { extra: api }) => {
    const { data } = await api.get<Offer[]>('/favorite');
    return data;
  }
);

export const toggleFavorite = createAsyncThunk<
  Offer,
  { offerId: number; status: 0 | 1 },
  { extra: AxiosInstance }
>(
  'favorites/toggleFavorite',
  async ({ offerId, status }, { extra: api }) => {
    const { data } = await api.post<Offer>(`/favorite/${offerId}/${status}`);
    return data;
  }
);

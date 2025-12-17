import { createAsyncThunk } from '@reduxjs/toolkit';
import { Offer } from '../types';

export const fetchOffers = createAsyncThunk<Offer[], string, { extra: any }>(
  'offers/fetchOffers',
  async (city, { extra: api }) => {
    const response = await api.get(`/offers?city=${city}`);
    return response.data;
  }
);

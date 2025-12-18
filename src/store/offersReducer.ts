import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Offer } from '../types';
import { AxiosInstance } from 'axios';

interface OffersState {
  city: string;
  offers: Offer[];
  loading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  city: 'Paris',
  offers: [],
  loading: false,
  error: null,
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: AxiosInstance }>(
  'offers/fetchOffers',
  async (_, { extra: api }) => {
    const { data } = await api.get<Offer[]>('/six-cities/offers');
    return data;
  }
);

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    changeCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action: PayloadAction<Offer[]>) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load offers';
      });
  },
});

export const { changeCity } = offersSlice.actions;
export default offersSlice.reducer;
export type OffersStateType = OffersState;

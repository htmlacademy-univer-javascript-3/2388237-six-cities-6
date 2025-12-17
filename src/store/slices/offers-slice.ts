import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../../types/offer';
import { CityName, DEFAULT_CITY } from '../../const';

export type ThunkExtraArg = AxiosInstance;

type OffersState = {
  city: CityName;
  offers: Offer[];
  isOffersLoading: boolean;
  offersError: string | null;
};

const initialState: OffersState = {
  city: DEFAULT_CITY,
  offers: [],
  isOffersLoading: false,
  offersError: null,
};

export const fetchOffersAction = createAsyncThunk<Offer[], void, { extra: ThunkExtraArg }>(
  'offers/fetchOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>('/offers');
    return data;
  }
);

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    changeCity: (state, action: PayloadAction<CityName>) => {
      state.city = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffersAction.pending, (state) => {
        state.isOffersLoading = true;
        state.offersError = null;
      })
      .addCase(fetchOffersAction.fulfilled, (state, action) => {
        state.isOffersLoading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffersAction.rejected, (state, action) => {
        state.isOffersLoading = false;
        state.offersError = action.error.message ?? 'Failed to load offers';
      });
  },
});

export const { changeCity } = offersSlice.actions;
export default offersSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import type { Offer } from '../../types/offer';
import { CityName, DEFAULT_CITY } from '../../const';

export type ThunkExtraArg = AxiosInstance;

type OffersState = {
  city: CityName;
  offers: Offer[];
  favorites: Offer[];

  isOffersLoading: boolean;
  isFavoritesLoading: boolean;

  offersError: string | null;
  favoritesError: string | null;
};

const initialState: OffersState = {
  city: DEFAULT_CITY,
  offers: [],
  favorites: [],

  isOffersLoading: false,
  isFavoritesLoading: false,

  offersError: null,
  favoritesError: null,
};

export const fetchOffersAction = createAsyncThunk<
  Offer[],
  void,
  { extra: ThunkExtraArg }
>('offers/fetchOffers', async (_arg, { extra: api }) => {
  const { data } = await api.get<Offer[]>('/offers');
  return data;
});

export const fetchFavoritesAction = createAsyncThunk<
  Offer[],
  void,
  { extra: ThunkExtraArg }
>('offers/fetchFavorites', async (_arg, { extra: api }) => {
  const { data } = await api.get<Offer[]>('/favorite');
  return data;
});

export const toggleFavoriteAction = createAsyncThunk<
  Offer,
  { offerId: string; status: 0 | 1 },
  { extra: ThunkExtraArg }
>('offers/toggleFavorite', async ({ offerId, status }, { extra: api }) => {
  const { data } = await api.post<Offer>(`/favorite/${offerId}/${status}`);
  return data;
});

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
      })

      .addCase(fetchFavoritesAction.pending, (state) => {
        state.isFavoritesLoading = true;
        state.favoritesError = null;
      })
      .addCase(fetchFavoritesAction.fulfilled, (state, action) => {
        state.isFavoritesLoading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavoritesAction.rejected, (state, action) => {
        state.isFavoritesLoading = false;
        state.favoritesError = action.error.message ?? 'Failed to load favorites';
      })

      .addCase(toggleFavoriteAction.fulfilled, (state, action) => {
        const updatedOffer = action.payload;

        const offerIndex = state.offers.findIndex((o) => o.id === updatedOffer.id);
        if (offerIndex !== -1) {
          state.offers[offerIndex] = updatedOffer;
        }

        if (updatedOffer.isFavorite) {
          const exists = state.favorites.some((o) => o.id === updatedOffer.id);
          if (!exists) {
            state.favorites.push(updatedOffer);
          }
        } else {
          state.favorites = state.favorites.filter((o) => o.id !== updatedOffer.id);
        }
      });
  },
});

export const { changeCity } = offersSlice.actions;
export default offersSlice.reducer;

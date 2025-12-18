import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Offer } from '../../types/offer';
import type { Review } from '../../types/review';
import { toggleFavoriteAction } from './offers-slice';

type ThunkExtraArg = AxiosInstance;

type OfferPageState = {
  offer: Offer | null;
  nearby: Offer[];
  reviews: Review[];
  isLoading: boolean;
  isPosting: boolean;
  notFound: boolean;
};

const initialState: OfferPageState = {
  offer: null,
  nearby: [],
  reviews: [],
  isLoading: false,
  isPosting: false,
  notFound: false,
};

export const fetchOfferByIdAction = createAsyncThunk<
  Offer,
  string,
  { extra: ThunkExtraArg; rejectValue: '404' | 'error' }
>('offerPage/fetchOfferById', async (offerId, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<Offer>(`/offers/${offerId}`);
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return rejectWithValue('404');
    }
    return rejectWithValue('error');
  }
});

export const fetchNearbyOffersAction = createAsyncThunk<
  Offer[],
  string,
  { extra: ThunkExtraArg }
>('offerPage/fetchNearby', async (offerId, { extra: api }) => {
  const { data } = await api.get<Offer[]>(`/offers/${offerId}/nearby`);
  return data;
});

export const fetchCommentsAction = createAsyncThunk<
  Review[],
  string,
  { extra: ThunkExtraArg }
>('offerPage/fetchComments', async (offerId, { extra: api }) => {
  const { data } = await api.get<Review[]>(`/comments/${offerId}`);
  return data;
});

export const postReviewAction = createAsyncThunk<
  Review[],
  { offerId: string; comment: string; rating: number },
  { extra: ThunkExtraArg }
>('offerPage/postReview', async ({ offerId, comment, rating }, { extra: api }) => {
  await api.post(`/comments/${offerId}`, { comment, rating });
  const { data } = await api.get<Review[]>(`/comments/${offerId}`);
  return data;
});

const offerPageSlice = createSlice({
  name: 'offerPage',
  initialState,
  reducers: {
    resetOfferPage(state) {
      state.offer = null;
      state.nearby = [];
      state.reviews = [];
      state.isLoading = false;
      state.isPosting = false;
      state.notFound = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(toggleFavoriteAction.fulfilled, (state, action) => {
        const updated = action.payload;
        if (state.offer?.id === updated.id) {
          state.offer = updated;
        }
        state.nearby = state.nearby.map((o) => (o.id === updated.id ? updated : o));
      })
      .addCase(fetchOfferByIdAction.pending, (state) => {
        state.isLoading = true;
        state.notFound = false;
      })
      .addCase(fetchOfferByIdAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offer = action.payload;
      })
      .addCase(fetchOfferByIdAction.rejected, (state, action) => {
        state.isLoading = false;
        state.offer = null;
        state.notFound = action.payload === '404';
      })
      .addCase(fetchNearbyOffersAction.fulfilled, (state, action) => {
        state.nearby = action.payload;
      })
      .addCase(fetchCommentsAction.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(postReviewAction.pending, (state) => {
        state.isPosting = true;
      })
      .addCase(postReviewAction.fulfilled, (state, action) => {
        state.isPosting = false;
        state.reviews = action.payload;
      })
      .addCase(postReviewAction.rejected, (state) => {
        state.isPosting = false;
      });
  },
});

export const { resetOfferPage } = offerPageSlice.actions;
export default offerPageSlice.reducer;

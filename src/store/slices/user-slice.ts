import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';

import { APIRoute, AuthorizationStatus } from '../../const';
import type { UserData } from '../../types/user';
import { saveToken } from '../../services/token';

type UserState = {
  authorizationStatus: AuthorizationStatus;
  user: UserData | null;
};

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
};

type ThunkApiConfig = {
  extra: AxiosInstance;
};

export const checkAuthAction = createAsyncThunk<UserData, void, ThunkApiConfig>(
  'user/checkAuth',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<UserData>(APIRoute.Login);
    return data;
  }
);

type LoginResponse = UserData & { token: string };

export const loginAction = createAsyncThunk<
  UserData,
  { email: string; password: string },
  ThunkApiConfig
>('user/login', async ({ email, password }, { extra: api }) => {
  const { data } = await api.post<LoginResponse>(APIRoute.Login, { email, password });
  saveToken(data.token);
  return data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    requireLogout: (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.user = action.payload;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.user = null;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.user = action.payload;
      })
      .addCase(loginAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.user = null;
      });
  },
});

export const { requireLogout } = userSlice.actions;
export default userSlice.reducer;

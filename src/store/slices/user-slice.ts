import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AxiosInstance, AxiosResponse } from 'axios';

import { APIRoute, AuthorizationStatus } from '../../const';
import type { UserData } from '../../types/user';
import { dropToken, saveToken } from '../../services/token';

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
  // AxiosInstance methods are often typed loosely in lint rules; explicitly type the response.
  const response: AxiosResponse<LoginResponse> = await api.post<LoginResponse, AxiosResponse<LoginResponse>>(
    APIRoute.Login,
    { email, password }
  );
  const { token, ...userData } = response.data;
  saveToken(token);
  return userData;
});

export const logoutAction = createAsyncThunk<void, void, ThunkApiConfig>(
  'user/logout',
  async (_arg, { extra: api }) => {
    try {
      await api.delete(APIRoute.Logout);
    } finally {
      // Even if request failed, remove local token to close the session.
      dropToken();
    }
  }
);

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
    builder
      .addCase(logoutAction.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.user = null;
      })
      .addCase(logoutAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.user = null;
      });
  },
});

export const { requireLogout } = userSlice.actions;
export default userSlice.reducer;

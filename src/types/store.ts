import type { AxiosInstance } from 'axios';
import type { RootState } from '../store';

export type ThunkApiConfig = {
  state: RootState;
  extra: AxiosInstance;
};

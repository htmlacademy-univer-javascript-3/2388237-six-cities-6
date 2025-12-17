import axios, { AxiosError, AxiosInstance } from 'axios';
import { dropToken, getToken } from '../services/token';

export const DEFAULT_API_BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
export const REQUEST_TIMEOUT = 5000;

export const createAPI = (baseURL: string = DEFAULT_API_BASE_URL): AxiosInstance => {
  const api = axios.create({
    baseURL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers['X-Token'] = token;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        dropToken();
      }
      return Promise.reject(error);
    }
  );

  return api;
};

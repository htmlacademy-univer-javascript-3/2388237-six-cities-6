import axios, { AxiosInstance } from 'axios';

export const DEFAULT_API_BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
export const REQUEST_TIMEOUT = 5000;

export const createAPI = (baseURL: string = DEFAULT_API_BASE_URL): AxiosInstance =>
  axios.create({
    baseURL,
    timeout: REQUEST_TIMEOUT,
  });

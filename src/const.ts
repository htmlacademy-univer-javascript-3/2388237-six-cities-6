export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
] as const;

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export const APIRoute = {
  Login: '/login',
} as const;

export const TokenName = 'six-cities-token';

export type CityName = (typeof CITIES)[number];

export const DEFAULT_CITY: CityName = 'Paris';

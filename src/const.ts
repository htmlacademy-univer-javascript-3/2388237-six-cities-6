export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
] as const;

export type CityName = (typeof CITIES)[number];
export const DEFAULT_CITY: CityName = 'Paris';

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export const APIRoute = {
  Login: '/login',
  Logout: '/logout',
  Offers: '/offers',
  Favorite: '/favorite',
  Comments: '/comments',
} as const;

export enum SortType {
  Popular = 'popular',
  PriceLowToHigh = 'priceLowToHigh',
  PriceHighToLow = 'priceHighToLow',
  TopRated = 'topRated',
}

export const SORT_LABELS: Record<SortType, string> = {
  [SortType.Popular]: 'Popular',
  [SortType.PriceLowToHigh]: 'Price: low to high',
  [SortType.PriceHighToLow]: 'Price: high to low',
  [SortType.TopRated]: 'Top rated first',
};

export const TokenName = 'six-cities-token';

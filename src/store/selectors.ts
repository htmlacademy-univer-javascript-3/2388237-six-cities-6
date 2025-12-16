export interface City {
  name: string;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface Host {
  name: string;
  avatarUrl: string;
  isPro: boolean;
}

export interface Offer {
  id: string;
  title: string;
  type: string;
  price: number;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage?: string;
  description?: string;
  bedrooms?: number;
  goods?: string[];
  host?: Host;
  images?: string[];
  maxAdults?: number;
}

export interface RootState {
  city: string;
  offers: Offer[];
}

export const getCity = (state: RootState): string => state.city;

export const getOffers = (state: RootState): Offer[] => state.offers;

export const getOffersByCity = (state: RootState): Offer[] =>
  state.city === 'All'
    ? state.offers
    : state.offers.filter((offer) => offer.city.name === state.city);

export const getOfferById = (state: RootState, id: string): Offer | undefined =>
  state.offers.find((offer) => offer.id === id);

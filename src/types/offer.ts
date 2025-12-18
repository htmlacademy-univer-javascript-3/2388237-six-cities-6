import { CityName } from '../const';
import type { UserData } from './user';

export type Offer = {
  id: string;
  title: string;
  type: string;
  price: number;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;

  description?: string;
  bedrooms?: number;
  goods?: string[];
  host: UserData;
  images?: string[];
  maxAdults?: number;
};

export type Location = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type City = {
  name: CityName;
  location: Location;
};



import { CityName } from '../const';
import { User } from './user';

export type Location = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type City = {
  name: CityName;
  location: Location;
};

export type Offer = {
  id: number;
  title: string;
  type: string;
  price: number;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;

  // поля для страницы предложения (сервер может возвращать их)
  description?: string;
  bedrooms?: number;
  goods?: string[];
  host?: User;
  images?: string[];
  maxAdults?: number;
};

import { User } from './user';

export interface Offer {
  id: number;
  title: string;
  price: number;
  type: string;
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  coordinates: [number, number];
  imageUrl: string;
  bedrooms: number;
  maxAdults: number;
  goods: string[];
  host: User;
}

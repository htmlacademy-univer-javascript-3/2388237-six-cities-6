import { User } from './user';

export interface Review {
  id: number;
  user: User;
  rating: number;
  comment: string;
  date: string;
}

import { User } from './user';

export type Review = {
  id: number;
  date: string;
  user: User;
  comment: string;
  rating: number;
};

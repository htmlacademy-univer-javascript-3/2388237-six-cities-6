import { UserData } from './user';

export type Review = {
  id: number;
  date: string;
  user: UserData;
  comment: string;
  rating: number;
};

import type { UserData } from './user';

export type Review = {
  id: string;
  date: string;
  user: UserData;
  comment: string;
  rating: number;
};

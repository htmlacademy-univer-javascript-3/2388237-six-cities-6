export interface Review {
  id: number;
  user: {
    name: string;
    avatarUrl: string;
    isPro?: boolean;
  };
  rating: number;
  comment: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    user: { name: 'Max', avatarUrl: 'img/avatar-max.jpg' },
    rating: 4,
    comment: 'A quiet cozy and picturesque that hides behind a river...',
    date: '2019-04-24',
  },
  {
    id: 2,
    user: { name: 'Anna', avatarUrl: 'img/avatar-angelina.jpg', isPro: true },
    rating: 5,
    comment: 'Amazing place, very clean and cozy!',
    date: '2020-06-12',
  },
];

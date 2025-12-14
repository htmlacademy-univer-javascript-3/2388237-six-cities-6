export type Offer = {
  id: number;
  title: string;
  type: 'Apartment' | 'Room' | 'Studio';
  price: number;
  rating: number;
  isPremium?: boolean;
  isFavorite?: boolean;
  imageUrl: string;
  city: string;
};

export const offers: Offer[] = [
  {
    id: 1,
    title: 'Beautiful & luxurious apartment at great location',
    type: 'Apartment',
    price: 120,
    rating: 4.8,
    isPremium: true,
    imageUrl: 'img/apartment-01.jpg',
    city: 'Amsterdam',
  },
  {
    id: 2,
    title: 'Wood and stone place',
    type: 'Room',
    price: 80,
    rating: 4.0,
    isFavorite: true,
    imageUrl: 'img/room.jpg',
    city: 'Amsterdam',
  },
  {
    id: 3,
    title: 'Canal View Prinsengracht',
    type: 'Apartment',
    price: 132,
    rating: 4.5,
    imageUrl: 'img/apartment-02.jpg',
    city: 'Amsterdam',
  },
  {
    id: 4,
    title: 'Nice, cozy, warm big bed apartment',
    type: 'Apartment',
    price: 180,
    rating: 5.0,
    isPremium: true,
    imageUrl: 'img/apartment-03.jpg',
    city: 'Amsterdam',
  },
];

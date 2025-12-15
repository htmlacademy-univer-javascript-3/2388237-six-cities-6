export interface Offer {
  id: number;
  title: string;
  type: string;
  price: number;
  rating: number;
  imageUrl: string;
  city: string;
  isPremium?: boolean;
  isFavorite?: boolean;
  coordinates: [number, number];
}

export const offers: Offer[] = [
  {
    id: 1,
    title: 'Apartment in Amsterdam',
    city: 'Amsterdam',
    coordinates: [52.39, 4.85],
    price: 120,
    rating: 4.8,
    type: 'Apartment',
    imageUrl: 'img/apartment-01.jpg',
  },
  {
    id: 2,
    title: 'Room in Paris',
    city: 'Paris',
    coordinates: [48.8566, 2.3522],
    price: 80,
    rating: 4.3,
    type: 'Private room',
    imageUrl: 'img/room.jpg',
  },
  {
    id: 3,
    title: 'Flat in Cologne',
    city: 'Cologne',
    coordinates: [50.9375, 6.9603],
    price: 110,
    rating: 4.5,
    type: 'Apartment',
    imageUrl: 'img/apartment-02.jpg',
  },
  {
    id: 4,
    title: 'House in Brussels',
    city: 'Brussels',
    coordinates: [50.8503, 4.3517],
    price: 150,
    rating: 4.9,
    type: 'House',
    imageUrl: 'img/apartment-03.jpg',
  },
];

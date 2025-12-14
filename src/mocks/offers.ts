export interface Offer {
  id: number;
  title: string;
  type: string;
  price: number;
  rating: number;
  imageUrl: string;
  isPremium?: boolean;
  isFavorite?: boolean;
  coordinates: [number, number]; // [широта, долгота]
}

export const offers: Offer[] = [
  {
    id: 1,
    title: 'Beautiful & luxurious apartment at great location',
    type: 'Apartment',
    price: 120,
    rating: 4.8,
    imageUrl: 'img/apartment-01.jpg',
    isPremium: true,
    isFavorite: false,
    coordinates: [52.3909553943508, 4.85309666406198],
  },
  {
    id: 2,
    title: 'Wood and stone place',
    type: 'Private room',
    price: 80,
    rating: 4.3,
    imageUrl: 'img/room.jpg',
    coordinates: [52.3609553943508, 4.85309666406198],
  },
  {
    id: 3,
    title: 'Canal View Prinsengracht',
    type: 'Apartment',
    price: 132,
    rating: 4.9,
    imageUrl: 'img/apartment-02.jpg',
    coordinates: [52.3909553943508, 4.929309666406198],
  },
  {
    id: 4,
    title: 'Nice, cozy, warm big bed apartment',
    type: 'Apartment',
    price: 180,
    rating: 5,
    imageUrl: 'img/apartment-03.jpg',
    coordinates: [52.3809553943508, 4.939309666406198],
  },
];

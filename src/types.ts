export interface Offer {
  id: number;
  title: string;
  price: number;
  rating: number;
  location: { lat: number; lng: number };
}

export type SomeType = 'popular' | 'priceLowToHigh' | 'priceHighToLow' | 'topRated';

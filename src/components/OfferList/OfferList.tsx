import React from 'react';
import { PlaceCard } from '../place-card/place-card';
import { Offer } from '../../mocks/offers';

interface OfferListProps {
  offers: Offer[];
}

export default function OfferList({ offers }: OfferListProps): JSX.Element {
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <PlaceCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}

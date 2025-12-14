import React from 'react';
import { PlaceCard } from '../place-card/place-card';
import { Offer } from '../../mocks/offers';

interface OfferListProps {
  offers: Offer[];
  onOfferHover?: (offerId: number | null) => void;
}

export default function OfferList({
  offers,
  onOfferHover = () => {},
}: OfferListProps): JSX.Element {
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <PlaceCard
          key={offer.id}
          offer={offer}
          onMouseEnter={() => onOfferHover(offer.id)}
          onMouseLeave={() => onOfferHover(null)}
        />
      ))}
    </div>
  );
}

import { memo } from 'react';
import { Offer } from '../../types/offer';

type PlaceCardProps = {
  offer: Offer;
};

function PlaceCard({ offer }: PlaceCardProps): JSX.Element {
  return (
    <article className="place-card">
      <h2>{offer.title}</h2>
    </article>
  );
}

export default memo(PlaceCard);
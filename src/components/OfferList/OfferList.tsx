import { Offer } from '../../types/offer';
import OfferCard from '../OfferCard/OfferCard';

type OfferListProps = {
  offers: Offer[];
  onOfferHover?: (id: number | null) => void;
};

export default function OfferList({ offers, onOfferHover }: OfferListProps): JSX.Element {
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} onHover={onOfferHover} />
      ))}
    </div>
  );
}

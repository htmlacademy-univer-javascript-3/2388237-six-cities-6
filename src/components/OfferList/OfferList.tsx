import { PlaceCard } from '../place-card/place-card';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOffers } from '../../store/offersActions';
import { RootState, AppDispatch } from '../../store/index';
import Spinner from '../Spinner';

interface OfferListProps {
  city: string;
  onOfferHover?: (offerId: number | null) => void;
}

export default function OfferList({
  city,
  onOfferHover = () => {},
}: OfferListProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { offers, loading, error } = useSelector((state: RootState) => state.offers);

  useEffect(() => {
    dispatch(fetchOffers(city));
  }, [city, dispatch]);

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <p>Ошибка: {error}</p>;
  }
  if (!offers.length) {
    return <p>No places to stay available</p>;
  }

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

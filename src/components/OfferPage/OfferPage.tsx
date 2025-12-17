import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { selectOfferById } from '../../store/selectors';

export default function OfferPage(): JSX.Element {
  const params = useParams();
  const id = Number(params.id);

  const offer = useAppSelector((state) => selectOfferById(state, id));

  if (!offer) {
    return <div style={{ padding: 16 }}>Offer not found</div>;
  }

  const ratingWidth = `${Math.round(offer.rating) * 20}%`;

  return (
    <div className="page">
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {(offer.images ?? []).slice(0, 6).map((src) => (
                <div className="offer__image-wrapper" key={src}>
                  <img className="offer__image" src={src} alt={offer.title} />
                </div>
              ))}
            </div>
          </div>

          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}

              <h1 className="offer__name">{offer.title}</h1>

              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: ratingWidth }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer.rating}</span>
              </div>

              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&#47;&nbsp;night</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

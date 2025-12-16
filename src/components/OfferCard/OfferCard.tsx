interface OfferCardProps {
  offer: Offer;
  onHover?: () => void;
  onLeave?: () => void;
}

export function OfferCard({ offer, onHover, onLeave }: OfferCardProps): JSX.Element {
  return (
    <div
      className="offer__wrapper"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {offer.isPremium && (
        <div className="offer__mark">
          <span>Premium</span>
        </div>
      )}

      <div className="offer__name-wrapper">
        <h1 className="offer__name">{offer.title}</h1>
        <button className="offer__bookmark-button button" type="button">
          <svg className="offer__bookmark-icon" width={31} height={33}>
            <use href="#icon-bookmark" />
          </svg>
          <span className="visually-hidden">
            {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
          </span>
        </button>
      </div>

      <div className="offer__rating rating">
        <div className="offer__stars rating__stars">
          <span style={{ width: `${offer.rating * 20}%` }} />
          <span className="visually-hidden">Rating</span>
        </div>
        <span className="offer__rating-value rating__value">{offer.rating}</span>
      </div>

      <ul className="offer__features">
        <li className="offer__feature offer__feature--entire">{offer.type}</li>
        <li className="offer__feature offer__feature--bedrooms">3 Bedrooms</li>
        <li className="offer__feature offer__feature--adults">Max 4 adults</li>
      </ul>

      <div className="offer__price">
        <b className="offer__price-value">&euro;{offer.price}</b>
        <span className="offer__price-text">&nbsp;night</span>
      </div>

      <div className="offer__inside">
        <h2 className="offer__inside-title">What&apos;s inside</h2>
        <ul className="offer__inside-list">
          {[
            'Wi-Fi',
            'Washing machine',
            'Towels',
            'Heating',
            'Coffee machine',
            'Baby seat',
            'Kitchen',
            'Dishwasher',
            'Cable TV',
            'Fridge',
          ].map((item) => (
            <li key={item} className="offer__inside-item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

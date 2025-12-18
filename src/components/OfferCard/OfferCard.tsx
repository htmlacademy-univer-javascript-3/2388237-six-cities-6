import { memo, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AuthorizationStatus } from '../../const';
import { selectAuthorizationStatus } from '../../store/selectors';
import { toggleFavoriteAction } from '../../store/slices/offers-slice';
import type { Offer } from '../../types/offer';

type OfferCardProps = {
  offer: Offer;
  onHover?: (id: string | null) => void;
};

function OfferCard({ offer, onHover }: OfferCardProps): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  const ratingWidth = useMemo(
    () => `${Math.round(offer.rating) * 20}%`,
    [offer.rating]
  );

  const handleFavoriteClick = useCallback(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    dispatch(
      toggleFavoriteAction({
        offerId: offer.id,
        status: offer.isFavorite ? 0 : 1,
      })
    );
  }, [dispatch, isAuth, navigate, offer.id, offer.isFavorite]);

  const handleMouseEnter = useCallback(() => {
    onHover?.(offer.id);
  }, [onHover, offer.id]);

  const handleMouseLeave = useCallback(() => {
    onHover?.(null);
  }, [onHover]);

  return (
    <article
      className="cities__card place-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}

      <div className="cities__image-wrapper place-card__image-wrapper">
        <Link to={`/offer/${offer.id}`}>
          <img
            className="place-card__image"
            src={offer.previewImage}
            width="260"
            height="200"
            alt={offer.title}
          />
        </Link>
      </div>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>

          <button
            className={`place-card__bookmark-button button ${
              offer.isFavorite ? 'place-card__bookmark-button--active' : ''
            }`}
            type="button"
            onClick={handleFavoriteClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark" />
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>

        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: ratingWidth }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>

        <h2 className="place-card__name">
          <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
        </h2>

        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>
  );
}

export default memo(OfferCard);
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AuthorizationStatus } from '../../const';
import { selectAuthorizationStatus } from '../../store/selectors';
import { fetchFavoritesAction, toggleFavoriteAction } from '../../store/slices/offers-slice';
import type { Offer } from '../../types/offer';

type PlaceCardProps = {
  offer: Offer;
};

function PlaceCard({ offer }: PlaceCardProps): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

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
    )
      .unwrap()
      .then(() => dispatch(fetchFavoritesAction()));
  }, [dispatch, isAuth, navigate, offer.id, offer.isFavorite]);

  return (
    <article className="place-card">
      <h2>{offer.title}</h2>

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
    </article>
  );
}

const MemoizedPlaceCard = memo(PlaceCard);
export default MemoizedPlaceCard;

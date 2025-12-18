import { useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import Map from '../Map/Map';
import ReviewForm from '../../components/Reviews/ReviewForm';

import { AuthorizationStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';

import type { Offer } from '../../types/offer';
import type { Review } from '../../types/review';

import {
  selectAuthorizationStatus,
  selectOfferPageOffer,
  selectOfferPageNearby,
  selectOfferPageReviews,
  selectOfferPageLoading,
  selectOfferPageNotFound,
} from '../../store/selectors';

import { toggleFavoriteAction } from '../../store/slices/offers-slice';
import {
  fetchOfferByIdAction,
  fetchNearbyOffersAction,
  fetchCommentsAction,
  resetOfferPage,
} from '../../store/slices/offer-page-slice';

export default function OfferPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const offer = useAppSelector(selectOfferPageOffer);
  const nearby = useAppSelector(selectOfferPageNearby);
  const reviews = useAppSelector(selectOfferPageReviews);
  const isLoading = useAppSelector(selectOfferPageLoading);
  const notFound = useAppSelector(selectOfferPageNotFound);

  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(resetOfferPage());
    dispatch(fetchOfferByIdAction(id));
    dispatch(fetchNearbyOffersAction(id));
    dispatch(fetchCommentsAction(id));

    return () => {
      dispatch(resetOfferPage());
    };
  }, [id, dispatch]);

  const handleFavoriteClick = () => {
    if (!offer) {
      return;
    }

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
  };

  const sortedReviews = useMemo<Review[]>(() => {
    const list = reviews.slice();
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return list.slice(0, 10);
  }, [reviews]);

  const mapOffers = useMemo<Offer[]>(() => {
    if (!offer) {
      return [];
    }
    return [offer, ...nearby.slice(0, 3)];
  }, [offer, nearby]);

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  if (isLoading || !offer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page">
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {(offer.images ?? []).slice(0, 6).map((src) => (
                <div className="offer__image-wrapper" key={src}>
                  <img className="offer__image" src={src} alt="Photo studio" />
                </div>
              ))}
            </div>
          </div>

          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium ? (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              ) : null}

              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer.title}</h1>

                <button
                  className={`offer__bookmark-button button ${
                    offer.isFavorite ? 'offer__bookmark-button--active' : ''
                  }`}
                  type="button"
                  onClick={handleFavoriteClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark" />
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>

              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${Math.round(offer.rating) * 20}%` }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer.rating}</span>
              </div>

              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">{offer.type}</li>

                {typeof offer.bedrooms === 'number' ? (
                  <li className="offer__feature offer__feature--bedrooms">
                    {offer.bedrooms} Bedrooms
                  </li>
                ) : null}

                {typeof offer.maxAdults === 'number' ? (
                  <li className="offer__feature offer__feature--adults">
                    Max {offer.maxAdults} adults
                  </li>
                ) : null}
              </ul>

              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>

              {(offer.goods ?? []).length > 0 ? (
                <div className="offer__inside">
                  <h2 className="offer__inside-title">What&apos;s inside</h2>
                  <ul className="offer__inside-list">
                    {(offer.goods ?? []).map((g) => (
                      <li className="offer__inside-item" key={g}>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {offer.description ? (
                <div className="offer__description">
                  <p className="offer__text">{offer.description}</p>
                </div>
              ) : null}

              <section className="offer__reviews reviews">
                <h2 className="reviews__title">
                  Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
                </h2>

                <ul className="reviews__list">
                  {sortedReviews.map((r) => (
                    <li className="reviews__item" key={r.id}>
                      <div className="reviews__user user">
                        <div className="reviews__avatar-wrapper user__avatar-wrapper">
                          <img
                            className="reviews__avatar user__avatar"
                            src={r.user.avatarUrl}
                            width="54"
                            height="54"
                            alt="Reviews avatar"
                          />
                        </div>
                        <span className="reviews__user-name">{r.user.name}</span>
                      </div>

                      <div className="reviews__info">
                        <div className="reviews__rating rating">
                          <div className="reviews__stars rating__stars">
                            <span style={{ width: `${Math.round(r.rating) * 20}%` }} />
                            <span className="visually-hidden">Rating</span>
                          </div>
                        </div>

                        <p className="reviews__text">{r.comment}</p>

                        <time className="reviews__time" dateTime={r.date}>
                          {new Date(r.date).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                    </li>
                  ))}
                </ul>

                {id ? <ReviewForm offerId={id} /> : null}
              </section>
            </div>
          </div>
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              {nearby.slice(0, 3).map((o) => (
                <div key={o.id}>{o.title}</div>
              ))}
            </div>
          </section>
          <section className="offer__map map">
          <Map
            offers={mapOffers}
            center={[offer.location.latitude, offer.location.longitude]}
            zoom={offer.city.location.zoom}
            activeOfferId={offer.id}
          />
        </section>
        </div>
      </main>
    </div>
  );
}
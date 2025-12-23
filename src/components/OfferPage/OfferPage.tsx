import { useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header/Header';
import Map from '../Map/Map';
import ReviewForm from '../Reviews/ReviewForm';
import OfferCard from '../OfferCard/OfferCard';

import { AuthorizationStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';

import type { Offer } from '../../types/offer';
import type { Review } from '../../types/review';

import {
  selectAuthorizationStatus,
  selectOfferPageLoading,
  selectOfferPageNearby,
  selectOfferPageNotFound,
  selectOfferPageOffer,
  selectOfferPageReviews,
} from '../../store/selectors';

import { toggleFavoriteAction } from '../../store/slices/offers-slice';
import {
  fetchCommentsAction,
  fetchNearbyOffersAction,
  fetchOfferByIdAction,
  resetOfferPage,
} from '../../store/slices/offer-page-slice';

const typeLabelMap: Record<string, string> = {
  apartment: 'Apartment',
  room: 'Room',
  house: 'House',
  hotel: 'Hotel',
};

const pluralize = (count: number, one: string, many: string): string =>
  count === 1 ? one : many;

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
    return (
      <div className="page">
        <Header />
        <main className="page__main page__main--offer" style={{ padding: 24 }}>
          Loading...
        </main>
      </div>
    );
  }

  const typeLabel = typeLabelMap[offer.type] ?? offer.type;
  const bedrooms = typeof offer.bedrooms === 'number' ? offer.bedrooms : 0;
  const maxAdults = typeof offer.maxAdults === 'number' ? offer.maxAdults : 0;

  return (
    <div className="page">
      <Header />

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
                <span className="offer__rating-value rating__value">{offer.rating.toFixed(1)}</span>
              </div>

              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">{typeLabel}</li>
                {bedrooms > 0 && (
                  <li className="offer__feature offer__feature--bedrooms">
                    {bedrooms} {pluralize(bedrooms, 'Bedroom', 'Bedrooms')}
                  </li>
                )}
                {maxAdults > 0 && (
                  <li className="offer__feature offer__feature--adults">
                    Max {maxAdults} {pluralize(maxAdults, 'adult', 'adults')}
                  </li>
                )}
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

              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>

                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper user__avatar-wrapper ${offer.host.isPro ? 'offer__avatar-wrapper--pro' : ''}`}>
                    <img
                      className="offer__avatar user__avatar"
                      src={offer.host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>

                  <span className="offer__user-name">{offer.host.name}</span>
                  {offer.host.isPro ? <span className="offer__user-status">Pro</span> : null}
                </div>

                {offer.description ? <p className="offer__text">{offer.description}</p> : null}
              </div>

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
          <section className="offer__map map">
            <Map
              offers={mapOffers}
              center={[offer.location.latitude, offer.location.longitude]}
              zoom={offer.city.location.zoom}
              activeOfferId={offer.id}
            />
          </section>

          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              {nearby.slice(0, 3).map((o) => (
                <OfferCard key={o.id} offer={o} variant="near" />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

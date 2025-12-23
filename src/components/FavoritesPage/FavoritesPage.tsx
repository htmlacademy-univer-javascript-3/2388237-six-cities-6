import { useEffect, useMemo } from 'react';
import { Navigate, Link } from 'react-router-dom';

import Header from '../Header/Header';
import { AuthorizationStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectAuthorizationStatus, selectFavorites } from '../../store/selectors';
import { fetchFavoritesAction, toggleFavoriteAction } from '../../store/slices/offers-slice';
import type { Offer } from '../../types/offer';

type FavoritesByCity = Record<string, Offer[]>;

export default function FavoritesPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const favorites = useAppSelector(selectFavorites);

  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchFavoritesAction());
    }
  }, [dispatch, isAuth]);

  const grouped = useMemo<FavoritesByCity>(() => {
    const res: FavoritesByCity = {};
    favorites.forEach((offer) => {
      // Some test fixtures may omit nested city fields; keep UI resilient.
      const city = offer.city?.name ?? 'Unknown';
      if (!res[city]) {
        res[city] = [];
      }
      res[city].push(offer);
    });
    return res;
  }, [favorites]);

  const handleRemoveFavorite = (offerId: string) => {
    void dispatch(toggleFavoriteAction({ offerId, status: 0 }))
      .unwrap()
      .then(() => dispatch(fetchFavoritesAction()));
  };

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  const cityNames = Object.keys(grouped);
  const isEmpty = favorites.length === 0;

  return (
    <div className={`page ${isEmpty ? 'page--favorites-empty' : ''}`}>
      <Header />

      <main className={`page__main page__main--favorites ${isEmpty ? 'page__main--favorites-empty' : ''}`}>
        <div className="page__favorites-container container">
          {isEmpty ? (
            <section className="favorites favorites--empty">
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">
                  Save properties to narrow down search or plan your future trips.
                </p>
              </div>
            </section>
          ) : (
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>

              <ul className="favorites__list">
                {cityNames.map((city) => (
                  <li className="favorites__locations-items" key={city}>
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <Link className="locations__item-link" to="/">
                          <span>{city}</span>
                        </Link>
                      </div>
                    </div>

                    <div className="favorites__places">
                      {grouped[city].map((offer) => (
                        <article className="favorites__card place-card" key={offer.id}>
                          {offer.isPremium && (
                            <div className="place-card__mark">
                              <span>Premium</span>
                            </div>
                          )}

                          <div className="favorites__image-wrapper place-card__image-wrapper">
                            <Link to={`/offer/${offer.id}`}>
                              <img
                                className="place-card__image"
                                src={offer.previewImage}
                                width="150"
                                height="110"
                                alt={offer.title}
                              />
                            </Link>
                          </div>

                          <div className="favorites__card-info place-card__info">
                            <div className="place-card__price-wrapper">
                              <div className="place-card__price">
                                <b className="place-card__price-value">&euro;{offer.price}</b>
                                <span className="place-card__price-text">&#47;&nbsp;night</span>
                              </div>

                              <button
                                className="place-card__bookmark-button place-card__bookmark-button--active button"
                                type="button"
                                onClick={() => handleRemoveFavorite(offer.id)}
                              >
                                <svg className="place-card__bookmark-icon" width="18" height="19">
                                  <use xlinkHref="#icon-bookmark" />
                                </svg>
                                <span className="visually-hidden">In bookmarks</span>
                              </button>
                            </div>

                            <div className="place-card__rating rating">
                              <div className="place-card__stars rating__stars">
                                <span style={{ width: `${Math.round(offer.rating) * 20}%` }} />
                                <span className="visually-hidden">Rating</span>
                              </div>
                            </div>

                            <h2 className="place-card__name">
                              <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
                            </h2>
                            <p className="place-card__type">{offer.type}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      <footer className="footer container">
        <Link className="footer__logo-link" to="/">
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </Link>
      </footer>
    </div>
  );
}

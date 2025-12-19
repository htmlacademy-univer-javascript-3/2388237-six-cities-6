import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthorizationStatus, CITIES, CityName } from '../../const';
import { dropToken } from '../../services/token';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { changeCity, fetchFavoritesAction } from '../../store/slices/offers-slice';
import { requireLogout } from '../../store/slices/user-slice';

import {
  makeSelectSortedOffersByCity,
  selectAuthorizationStatus,
  selectCity,
  selectIsOffersLoading,
  selectOffersError,
  selectUser,
  selectFavoriteCount,
} from '../../store/selectors';

import CitiesList from '../cities-list/cities-list';
import Map from '../Map/Map';
import OfferList from '../OfferList/OfferList';
import SortOptions, { SortType } from '../SortOptions/SortOptions';
import Spinner from '../Spinner';

import { MainEmptyPage } from '../MainEmptyPage/MainEmptyPage';

export default function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const user = useAppSelector(selectUser);

  const activeCity = useAppSelector(selectCity);
  const isLoading = useAppSelector(selectIsOffersLoading);
  const error = useAppSelector(selectOffersError);

  const favoritesCount = useAppSelector(selectFavoriteCount);

  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [sortType, setSortType] = useState<SortType>('popular');

  const selectSortedOffers = useMemo(makeSelectSortedOffersByCity, []);
  const sortedOffers = useAppSelector((state) => selectSortedOffers(state, sortType));

  const activeOffer = useMemo(
    () => sortedOffers.find((offer) => offer.id === activeOfferId) ?? null,
    [sortedOffers, activeOfferId]
  );

  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchFavoritesAction());
    }
  }, [dispatch, isAuth]);

  const isEmpty = !isLoading && !error && sortedOffers.length === 0;

  const mapCenter = useMemo<[number, number]>(() => {
    if (activeOffer) {
      return [activeOffer.location.latitude, activeOffer.location.longitude];
    }

    if (sortedOffers.length > 0) {
      return [
        sortedOffers[0].city.location.latitude,
        sortedOffers[0].city.location.longitude,
      ];
    }

    return [52.38333, 4.9];
  }, [activeOffer, sortedOffers]);

  const zoom = useMemo(
    () => (sortedOffers.length > 0 ? sortedOffers[0].city.location.zoom : 12),
    [sortedOffers]
  );

  const handleCityClick = useCallback(
    (city: CityName) => {
      dispatch(changeCity(city));
    },
    [dispatch]
  );

  const handleOfferHover = useCallback((id: string | null) => {
    setActiveOfferId(id);
  }, []);

  const handleSortChange = useCallback((type: SortType) => {
    setSortType(type);
  }, []);

  const handleLogout = useCallback(() => {
    dropToken();
    dispatch(requireLogout());
  }, [dispatch]);

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link header__logo-link--active" to="/">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width={81}
                  height={41}
                />
              </Link>
            </div>

            <nav className="header__nav">
              <ul className="header__nav-list">
                {!isAuth ? (
                  <li className="header__nav-item user">
                    <Link className="header__nav-link header__nav-link--profile" to="/login">
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                ) : (
                  <>
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                        <div className="header__avatar-wrapper user__avatar-wrapper">
                          {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="avatar" width={20} height={20} />
                          ) : null}
                        </div>

                        <span className="header__user-name user__name">{user?.email}</span>

                        {/* СЧЁТЧИК ИЗБРАННОГО */}
                        <span className="header__favorite-count">{favoritesCount}</span>
                      </Link>
                    </li>

                    <li className="header__nav-item">
                      <button className="header__nav-link" type="button" onClick={handleLogout}>
                        <span className="header__signout">Sign out</span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main
        className={`page__main page__main--index ${isEmpty ? 'page__main--index-empty' : ''}`}
      >
        <h1 className="visually-hidden">Cities</h1>

        <div className="tabs">
          <CitiesList cities={CITIES} activeCity={activeCity} onCityClick={handleCityClick} />
        </div>

        <div className="cities">
          <div
            className={`cities__places-container container ${
              isEmpty ? 'cities__places-container--empty' : ''
            }`}
          >
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>

              {isLoading && <Spinner />}

              {!isLoading && error && (
                <p style={{ padding: 16 }}>
                  Не удалось загрузить предложения. Попробуйте обновить страницу.
                </p>
              )}

              {!isLoading && !error && isEmpty && <MainEmptyPage />}

              {!isLoading && !error && !isEmpty && (
                <>
                  <b className="places__found">
                    {sortedOffers.length} places to stay in {activeCity}
                  </b>

                  <SortOptions sortType={sortType} onSortChange={handleSortChange} />
                  <OfferList offers={sortedOffers} onOfferHover={handleOfferHover} />
                </>
              )}
            </section>

            {!isEmpty && (
              <div className="cities__right-section">
                <section className="cities__map map">
                  {!isLoading && !error && (
                    <Map
                      offers={sortedOffers}
                      center={mapCenter}
                      zoom={zoom}
                      activeOfferId={activeOfferId}
                    />
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

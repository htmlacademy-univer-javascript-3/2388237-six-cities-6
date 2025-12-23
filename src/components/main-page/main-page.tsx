import { useCallback, useEffect, useMemo, useState } from 'react';

import { CITIES, CityName } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { changeCity, fetchFavoritesAction } from '../../store/slices/offers-slice';
import {
  makeSelectSortedOffersByCity,
  selectAuthorizationStatus,
  selectCity,
  selectIsOffersLoading,
  selectOffersError,
} from '../../store/selectors';
import { AuthorizationStatus } from '../../const';

import Header from '../Header/Header';
import CitiesList from '../cities-list/cities-list';
import Map from '../Map/Map';
import OfferList from '../OfferList/OfferList';
import { SortType } from '../../const';
import SortOptions from '../SortOptions/SortOptions';
import Spinner from '../Spinner';
import { MainEmptyPage } from '../MainEmptyPage/MainEmptyPage';

export default function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const activeCity = useAppSelector(selectCity);
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isLoading = useAppSelector(selectIsOffersLoading);
  const error = useAppSelector(selectOffersError);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchFavoritesAction());
    }
  }, [authorizationStatus, dispatch]);

  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [sortType, setSortType] = useState<SortType>(SortType.Popular);

  const selectSortedOffers = useMemo(makeSelectSortedOffersByCity, []);
  const sortedOffers = useAppSelector((state) => selectSortedOffers(state, sortType));

  const activeOffer = useMemo(
    () => sortedOffers.find((offer) => offer.id === activeOfferId) ?? null,
    [sortedOffers, activeOfferId]
  );

  const isEmpty = !isLoading && !error && sortedOffers.length === 0;

  const mapCenter = useMemo<[number, number]>(() => {
    if (activeOffer) {
      return [activeOffer.location.latitude, activeOffer.location.longitude];
    }
    if (sortedOffers.length > 0) {
      return [sortedOffers[0].city.location.latitude, sortedOffers[0].city.location.longitude];
    }
    return [52.38333, 4.9];
  }, [activeOffer, sortedOffers]);

  const zoom = useMemo(() => (sortedOffers.length > 0 ? sortedOffers[0].city.location.zoom : 12), [
    sortedOffers,
  ]);

  const handleCityClick = useCallback(
    (city: CityName) => {
      dispatch(changeCity(city));
      setActiveOfferId(null);
    },
    [dispatch]
  );

  const handleOfferHover = useCallback((id: string | null) => {
    setActiveOfferId(id);
  }, []);

  const handleSortChange = useCallback((type: SortType) => {
    setSortType(type);
  }, []);

  return (
    <div className="page page--gray page--main">
      <Header />

      <main className={`page__main page__main--index ${isEmpty ? 'page__main--index-empty' : ''}`}>
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
            {isLoading && <Spinner />}

            {!isLoading && error && (
              <p style={{ padding: 16 }}>
                Не удалось загрузить предложения. Попробуйте обновить страницу.
              </p>
            )}

            {!isLoading && !error && isEmpty && (
              <>
                <section className="cities__no-places">
                  <MainEmptyPage cityName={activeCity} />
                </section>

                <div className="cities__right-section">
                  <section className="cities__map map">
                    <img
                      src="img/no-places.png"
                      alt="No places"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </section>
                </div>
              </>
            )}

            {!isLoading && !error && !isEmpty && (
              <>
                <section className="cities__places places">
                  <h2 className="visually-hidden">Places</h2>

                  <b className="places__found">
                    {sortedOffers.length} places to stay in {activeCity}
                  </b>

                  <SortOptions sortType={sortType} onSortChange={handleSortChange} />
                  <OfferList offers={sortedOffers} onOfferHover={handleOfferHover} />
                </section>

                <div className="cities__right-section">
                  <section className="cities__map map">
                    <Map offers={sortedOffers} center={mapCenter} zoom={zoom} activeOfferId={activeOfferId} />
                  </section>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

import { useMemo, useState } from 'react';

import { CITIES, CityName } from '../../const';
import { changeCity } from '../../store/slices/offers-slice';
import {
  selectCity,
  selectIsOffersLoading,
  selectOffersByCity,
  selectOffersError,
} from '../../store/selectors';

import CitiesList from '../cities-list/cities-list';
import Map from '../Map/Map';
import OfferList from '../OfferList/OfferList';
import SortOptions, { SortType } from '../SortOptions/SortOptions';
import Spinner from '../Spinner';

import { useAppDispatch, useAppSelector } from '../../hooks';

export default function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const activeCity = useAppSelector(selectCity);
  const offers = useAppSelector(selectOffersByCity);
  const isLoading = useAppSelector(selectIsOffersLoading);
  const error = useAppSelector(selectOffersError);

  const [activeOfferId, setActiveOfferId] = useState<number | null>(null);
  const [sortType, setSortType] = useState<SortType>('popular');

  const sortedOffers = useMemo(() => {
    const result = [...offers];

    switch (sortType) {
      case 'priceLowToHigh':
        return result.sort((a, b) => a.price - b.price);
      case 'priceHighToLow':
        return result.sort((a, b) => b.price - a.price);
      case 'topRated':
        return result.sort((a, b) => b.rating - a.rating);
      case 'popular':
      default:
        return result;
    }
  }, [offers, sortType]);

  const activeOffer = sortedOffers.find((o) => o.id === activeOfferId);

  let mapCenter: [number, number] = [52.38333, 4.9];
  if (sortedOffers.length > 0) {
    mapCenter = [
      sortedOffers[0].city.location.latitude,
      sortedOffers[0].city.location.longitude,
    ];
  }
  if (activeOffer) {
    mapCenter = [activeOffer.location.latitude, activeOffer.location.longitude];
  }

  const zoom = sortedOffers.length > 0 ? sortedOffers[0].city.location.zoom : 12;

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link header__logo-link--active" href="/">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width={81}
                  height={41}
                />
              </a>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item">
                  <a className="header__nav-link" href="/login">
                    <span className="header__signout">Sign in</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>

        <div className="tabs">
          <CitiesList
            cities={CITIES}
            activeCity={activeCity}
            onCityClick={(city: CityName) => dispatch(changeCity(city))}
          />
        </div>

        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>

              {isLoading && <Spinner />}

              {!isLoading && error && (
                <p style={{ padding: 16 }}>
                  Не удалось загрузить предложения. Попробуйте обновить страницу.
                </p>
              )}

              {!isLoading && !error && (
                <>
                  <b className="places__found">
                    {sortedOffers.length} places to stay in {activeCity}
                  </b>

                  <SortOptions sortType={sortType} onSortChange={setSortType} />
                  <OfferList offers={sortedOffers} onOfferHover={setActiveOfferId} />
                </>
              )}
            </section>

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
          </div>
        </div>
      </main>
    </div>
  );
}

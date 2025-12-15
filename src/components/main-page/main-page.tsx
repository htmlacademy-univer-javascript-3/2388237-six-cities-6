import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import OfferList from '../OfferList/OfferList';
import Map from '../Map/Map';
import CitiesList from '../cities-list/cities-list';
import { CITIES } from '../../const';
import { getCity, getOffersByCity } from '../../store/selectors';
import { changeCity } from '../../store/action';
import { Offer } from '../../mocks/offers';
import SortOptions, { SortType } from '../SortOptions/SortOptions';

export default function MainPage(): JSX.Element {
  const dispatch = useDispatch();

  const activeCity = useSelector((state: RootState) => getCity(state));
  const offers = useSelector((state: RootState) => getOffersByCity(state));

  const [activeOfferId, setActiveOfferId] = useState<number | null>(null);
  const [sortType, setSortType] = useState<SortType>('popular');

  const activeOffer = offers.find((o: Offer) => o.id === activeOfferId);

  const defaultCoordinates: [number, number] = [52.38333, 4.9];
  let mapCenter: [number, number] = defaultCoordinates;

  if (activeOffer) {
    mapCenter = activeOffer.coordinates;
  } else if (offers.length > 0) {
    mapCenter = offers[0].coordinates;
  }

  const sortedOffers = [...offers];
  switch (sortType) {
    case 'priceLowToHigh':
      sortedOffers.sort((a, b) => a.price - b.price);
      break;
    case 'priceHighToLow':
      sortedOffers.sort((a, b) => b.price - a.price);
      break;
    case 'topRated':
      sortedOffers.sort((a, b) => b.rating - a.rating);
      break;
    case 'popular':
    default:
      break;
  }

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link header__logo-link--active">
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
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper" />
                    <span className="header__user-name user__name">
                      Oliver.conner@gmail.com
                    </span>
                    <span className="header__favorite-count">3</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
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
            onCityClick={(city: string) => dispatch(changeCity(city))}
          />
        </div>

        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {offers.length} places to stay in {activeCity}
              </b>

              <SortOptions sortType={sortType} onSortChange={setSortType} />

              <OfferList offers={sortedOffers} onOfferHover={setActiveOfferId} />
            </section>

            <div className="cities__right-section">
              <section className="cities__map map">
                <Map offers={sortedOffers} center={mapCenter} zoom={12} activeOfferId={activeOfferId} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

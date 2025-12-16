import React from 'react';
import { useParams } from 'react-router-dom';
import { OfferCard } from '../OfferCard/OfferCard';
import { PlaceCard } from '../place-card/place-card';
import ReviewsList from '../Reviews/ReviewsList';
import Map from '../Map/Map';

export default function OfferPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const offer: Offer | undefined = offers.find((o) => o.id === Number(id));

  if (!offer) {
    return <div>Offer not found</div>;
  }

  const mapCenter: [number, number] = offer.coordinates;

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link" href="/main">
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

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              <div className="offer__image-wrapper">
                <img className="offer__image" src={offer.imageUrl} alt={offer.title} />
              </div>
              {/* При необходимости сюда можно добавить остальные фото */}
            </div>
          </div>

          <div className="offer__container container">
            <OfferCard offer={offer} />
          </div>

          <section className="offer__map map">
            <Map offers={offers} center={mapCenter} zoom={12} />
          </section>

          <ReviewsList reviews={reviews} />
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              {offers
                .filter((o) => o.id !== offer.id)
                .map((nearOffer) => (
                  <PlaceCard key={nearOffer.id} offer={nearOffer} />
                ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

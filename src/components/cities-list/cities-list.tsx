import { CityName } from '../../const';

type CitiesListProps = {
  cities: readonly CityName[];
  activeCity: CityName;
  onCityClick: (city: CityName) => void;
};

export default function CitiesList({ cities, activeCity, onCityClick }: CitiesListProps): JSX.Element {
  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((city) => (
            <li key={city} className="locations__item">
              <a
                className={`locations__item-link tabs__item ${city === activeCity ? 'tabs__item--active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onCityClick(city);
                }}
              >
                <span>{city}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

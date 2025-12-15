type CitiesListProps = {
  cities: string[];
  activeCity: string;
  onCityClick: (city: string) => void;
};

export default function CitiesList({ cities, activeCity, onCityClick }: CitiesListProps) {
  return (
    <section className="locations container">
      <ul className="locations__list tabs__list">
        {cities.map((city) => (
          <li className="locations__item" key={city}>
            <a
              className={`locations__item-link tabs__item ${city === activeCity ? 'tabs__item--active' : ''}`}
              onClick={() => onCityClick(city)}
              href="#"
            >
              <span>{city}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

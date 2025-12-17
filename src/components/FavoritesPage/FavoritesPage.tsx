import { useAppSelector } from '../../hooks';
import { selectOffers } from '../../store/selectors';

export default function FavoritesPage(): JSX.Element {
  const offers = useAppSelector(selectOffers);
  const favorites = offers.filter((o) => o.isFavorite);

  return (
    <div style={{ padding: 16 }}>
      <h1>Favorites</h1>
      {favorites.length === 0 ? <p>Nothing yet saved</p> : <p>{favorites.length} saved offers</p>}
    </div>
  );
}

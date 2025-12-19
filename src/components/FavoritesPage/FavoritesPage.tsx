import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AuthorizationStatus } from '../../const';
import { selectAuthorizationStatus, selectFavorites } from '../../store/selectors';
import { fetchFavoritesAction } from '../../store/slices/offers-slice';

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

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Favorites</h1>
      {favorites.length === 0 ? (
        <p>Nothing yet saved</p>
      ) : (
        <p>{favorites.length} saved offers</p>
      )}
    </div>
  );
}

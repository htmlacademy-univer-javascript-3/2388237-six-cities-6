import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import MainPage from './main-page/main-page';
import LoginPage from './LoginPage/LoginPage';
import FavoritesPage from './FavoritesPage/FavoritesPage';
import OfferPage from './OfferPage/OfferPage';
import NotFoundPage from './NotFoundPage/NotFoundPage';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import ServerUnavailableBanner from './ServerUnavailableBanner/ServerUnavailableBanner';

import { fetchFavoritesAction, fetchOffersAction } from '../store/slices/offers-slice';
import { checkAuthAction } from '../store/slices/user-slice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectAuthorizationStatus } from '../store/selectors';
import { AuthorizationStatus } from '../const';

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  useEffect(() => {
    dispatch(checkAuthAction());
    dispatch(fetchOffersAction());
  }, [dispatch]);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchFavoritesAction());
    }
  }, [authorizationStatus, dispatch]);

  return (
    <>
      <ServerUnavailableBanner />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

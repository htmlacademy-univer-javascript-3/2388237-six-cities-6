import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import MainPage from './main-page/main-page';
import LoginPage from './LoginPage/LoginPage';
import FavoritesPage from './FavoritesPage/FavoritesPage';
import OfferPage from './OfferPage/OfferPage';
import NotFoundPage from './NotFoundPage/NotFoundPage';
import PrivateRoute from './PrivateRoute/PrivateRoute';

import { fetchOffersAction } from '../store/slices/offers-slice';
import { checkAuthAction } from '../store/slices/user-slice';
import { useAppDispatch } from '../hooks';

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthAction());
    dispatch(fetchOffersAction());
  }, [dispatch]);

  return (
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
  );
}

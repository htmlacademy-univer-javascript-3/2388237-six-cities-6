import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './main-page/main-page';
import LoginPage from './LoginPage/LoginPage';
import FavoritesPage from './FavoritesPage/FavoritesPage';
import OfferPage from './OfferPage/OfferPage';
import NotFoundPage from './NotFoundPage/NotFoundPage';
import PrivateRoute from './PrivateRoute/PrivateRoute';

type AppProps = {
  placesCount: number;
};

function App({ placesCount }: AppProps) {
  const isAuthorized = false; // Пока пользователь всегда не авторизован

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage placesCount={placesCount} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  children: JSX.Element;
  isAuthorized: boolean;
};

const PrivateRoute = ({ children, isAuthorized }: PrivateRouteProps) => {
  if (!isAuthorized) {
    // Если пользователь не авторизован — перенаправляем на логин
    return <Navigate to="/login" replace />;
  }
  return children; // Иначе показываем защищённый контент
};

export default PrivateRoute;

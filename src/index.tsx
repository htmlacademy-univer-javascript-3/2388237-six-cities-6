import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { offers } from './mocks/offers'; // импортируем мок-данные

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App offers={offers} />
  </React.StrictMode>
);

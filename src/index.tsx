import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/App';
import { store } from './store';
import { offers } from './mocks/offers';
import 'leaflet/dist/leaflet.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App offers={offers} />
    </Provider>
  </React.StrictMode>
);

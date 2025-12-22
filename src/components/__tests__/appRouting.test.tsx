import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from '../App';
import { store } from '../../store';

const renderApp = (route: string) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </Provider>
  );

describe('App routing', () => {
  it('should render Main page when user navigate to "/"', () => {
    renderApp('/');

    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('should render Login page when user navigate to "/login"', () => {
    renderApp('/login');

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should render NotFound page when user navigate to unknown route', () => {
    renderApp('/unknown-route');

    expect(screen.getByText(/404 not found/i)).toBeInTheDocument();
  });
});

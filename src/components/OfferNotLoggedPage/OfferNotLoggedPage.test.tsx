import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { OfferNotLogged } from './OfferNotLoggedPage';

describe('OfferNotLoggedPage', () => {
  it('renders header sign in', () => {
    render(<OfferNotLogged />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByAltText('6 cities logo')).toBeInTheDocument();
  });

  it('renders offer title and premium mark', () => {
    const { container } = render(<OfferNotLogged />);

    expect(screen.getAllByText('Premium').length).toBeGreaterThan(0);

    const offerPremium = container.querySelector('.offer__mark span');
    expect(offerPremium).not.toBeNull();
    expect(offerPremium?.textContent).toBe('Premium');

    expect(
      screen.getByRole('heading', { name: /beautiful & luxurious studio at great location/i })
    ).toBeInTheDocument();
  });

  it('renders gallery images', () => {
    const { container } = render(<OfferNotLogged />);

    const images = container.querySelectorAll('.offer__gallery .offer__image');
    expect(images.length).toBe(6);
  });

  it('renders inside items list', () => {
    render(<OfferNotLogged />);

    expect(screen.getByText('What\'s inside')).toBeInTheDocument();
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Dishwasher')).toBeInTheDocument();
  });

  it('renders reviews section', () => {
    render(<OfferNotLogged />);

    expect(screen.getByText(/reviews/i)).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
  });
});

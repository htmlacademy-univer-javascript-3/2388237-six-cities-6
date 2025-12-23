import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Map from './Map';

vi.mock('leaflet', () => {
  const mapObj = {
    setView: vi.fn().mockReturnThis(),
    remove: vi.fn(),
  };

  return {
    __esModule: true,
    default: {
      map: vi.fn(() => mapObj),
      tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
      marker: vi.fn(() => ({ addTo: vi.fn(), bindPopup: vi.fn(), remove: vi.fn() })),
    },
    map: vi.fn(() => mapObj),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    marker: vi.fn(() => ({ addTo: vi.fn(), bindPopup: vi.fn(), remove: vi.fn() })),
  };
});

vi.mock('./map-icons', () => ({
  defaultIcon: {},
  activeIcon: {},
}));

describe('Map', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders map container', () => {
    const { container } = render(
      <Map
        offers={[
          {
            id: '1',
            title: 'Offer',
            type: 'apartment',
            price: 100,
            city: {
              name: 'Paris',
              location: { latitude: 48.85661, longitude: 2.351499, zoom: 13 },
            },
            location: { latitude: 48.85661, longitude: 2.351499, zoom: 13 },
            isFavorite: false,
            isPremium: false,
            rating: 4.2,
            previewImage: 'img.jpg',
            images: [],
            bedrooms: 1,
            maxAdults: 2,
            goods: [],
            host: { id: 1, name: 'Host', avatarUrl: 'img.jpg', isPro: true },
            description: 'desc',
          },
        ]}
        center={[48.85661, 2.351499]}
        zoom={13}
        activeOfferId={null}
      />
    );

    expect(container.querySelector('div')).toBeTruthy();
  });
});

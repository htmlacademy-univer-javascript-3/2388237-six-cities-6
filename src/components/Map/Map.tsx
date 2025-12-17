import { useEffect, useRef } from 'react';
import leaflet, { Map as LeafletMap, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Offer } from '../../types/offer';

type MapProps = {
  offers: Offer[];
  center: [number, number];
  zoom: number;
  activeOfferId?: number | null;
};

const defaultIcon = leaflet.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});

const activeIcon = leaflet.icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});

export default function Map({ offers, center, zoom, activeOfferId = null }: MapProps): JSX.Element {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) {
      return;
    }

    const map = leaflet.map(mapRef.current).setView(center, zoom);

    leaflet
      .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      })
      .addTo(map);

    mapInstanceRef.current = map;
  }, [center, zoom]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    map.setView(center, zoom);
  }, [center, zoom]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    // удалить старые маркеры
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // добавить новые
    offers.forEach((offer) => {
      const marker = leaflet.marker(
        [offer.location.latitude, offer.location.longitude],
        { icon: offer.id === activeOfferId ? activeIcon : defaultIcon }
      );

      marker.bindPopup(offer.title);
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [offers, activeOfferId]);

  return <div ref={mapRef} style={{ height: '100%' }} />;
}

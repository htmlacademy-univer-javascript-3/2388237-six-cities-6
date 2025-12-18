import { memo, useEffect, useMemo, useRef } from 'react';
import leaflet, { Map as LeafletMap, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Offer } from '../../types/offer';

type MapProps = {
  offers: Offer[];
  center: [number, number];
  zoom: number;
  activeOfferId?: string | null;
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

function Map({ offers, center, zoom, activeOfferId = null }: MapProps): JSX.Element {
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

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    map.setView(center, zoom, { animate: false });
  }, [center, zoom]);

  const markerPoints = useMemo(
    () =>
      offers.map((offer) => ({
        id: offer.id,
        title: offer.title,
        lat: offer.location.latitude,
        lng: offer.location.longitude,
        isActive: offer.id === activeOfferId,
      })),
    [offers, activeOfferId]
  );

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    markerPoints.forEach((p) => {
      const marker = leaflet.marker([p.lat, p.lng], {
        icon: p.isActive ? activeIcon : defaultIcon,
      });

      marker.bindPopup(p.title);
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [markerPoints]);

  return <div ref={mapRef} style={{ height: '100%' }} />;
}

export default memo(Map);

import { memo, useEffect, useMemo, useRef } from 'react';
import leaflet, { Map as LeafletMap, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { Offer } from '../../types/offer';
import { activeIcon, defaultIcon } from './map-icons';

type MapProps = {
  offers: Offer[];
  center: [number, number];
  zoom: number;
  activeOfferId?: string | null;
};

function MapComponent({ offers, center, zoom, activeOfferId = null }: MapProps): JSX.Element {
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
  }, [center, zoom]);

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

const Map = memo(MapComponent);
export default Map;

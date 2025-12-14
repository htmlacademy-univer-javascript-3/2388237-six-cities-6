import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Offer } from '../../mocks/offers';

type MapProps = {
  offers: Offer[];
  center: [number, number];
  zoom: number;
};

export default function Map({ offers, center, zoom }: MapProps) {
  const icon = new Icon({
    iconUrl: 'img/pin.svg',
    iconSize: [30, 30],
  });

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {offers.map((offer) => (
        <Marker key={offer.id} position={offer.coordinates} icon={icon}>
          <Popup>{offer.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

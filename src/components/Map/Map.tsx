import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Offer } from '../../mocks/offers';

type MapProps = {
  offers: Offer[];
  center: [number, number];
  zoom: number;
};

const defaultIcon = new Icon({
  iconUrl: 'img/pin.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function Map({ offers, center, zoom }: MapProps): JSX.Element {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      <ChangeView center={center} zoom={zoom} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {offers.map((offer) => (
        <Marker
          key={offer.id}
          position={offer.coordinates}
          icon={defaultIcon}
        >
          <Popup>{offer.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

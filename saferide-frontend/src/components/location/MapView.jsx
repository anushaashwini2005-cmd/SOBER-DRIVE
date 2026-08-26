import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom colored dot markers (Leaflet's default marker images 404 under
// bundlers unless configured — divIcon avoids that entirely).
function dotIcon(color, pulse = false) {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:18px;height:18px;">
      <div style="width:18px;height:18px;border-radius:50%;background:${color};border:3px solid #0a0e1a;box-shadow:0 0 0 2px ${color}55;"></div>
      ${pulse ? `<div style="position:absolute;inset:-6px;border-radius:50%;border:2px solid ${color};opacity:0.5;animation:mapPulse 1.6s ease-out infinite;"></div>` : ''}
    </div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

export default function MapView({
  current, pickup, destination, driver,
  height = 320, zoom = 13, showRoute = true,
}) {
  const center = current || pickup || destination || { lat: 37.7749, lng: -122.4194 };
  const route = [pickup, destination].filter(Boolean).map((p) => [p.lat, p.lng]);

  return (
    <div style={{ height, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-soft)', position: 'relative' }}>
      <style>{`
        @keyframes mapPulse { 0% { transform: scale(0.6); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        .leaflet-container { background: #0a0e1a !important; }
        .leaflet-control-attribution { background: rgba(10,14,26,0.7) !important; color: #6b7394 !important; font-size: 10px !important; }
        .leaflet-control-attribution a { color: #8b93a7 !important; }
        .leaflet-control-zoom a { background: #131a30 !important; color: #f4f6fb !important; border-color: #1e2748 !important; }
      `}</style>
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} style={{ height: '100%', width: '100%' }} zoomControl={true} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />
        <Recenter center={current ? [current.lat, current.lng] : null} />

        {showRoute && route.length === 2 && (
          <Polyline positions={route} pathOptions={{ color: '#7c6cf6', weight: 3, opacity: 0.7, dashArray: '6 8' }} />
        )}

        {current && (
          <Marker position={[current.lat, current.lng]} icon={dotIcon('#3b82f6', true)}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]} icon={dotIcon('#22c55e')}>
            <Popup>Pickup — {pickup.label || 'Set location'}</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={dotIcon('#f5a524')}>
            <Popup>Destination — {destination.label || 'Set location'}</Popup>
          </Marker>
        )}
        {driver && (
          <Marker position={[driver.lat, driver.lng]} icon={dotIcon('#ef4444', true)}>
            <Popup>{driver.name || 'Driver'}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

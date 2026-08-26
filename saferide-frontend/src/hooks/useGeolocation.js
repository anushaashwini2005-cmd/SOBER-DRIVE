import { useCallback, useEffect, useState } from 'react';

const FALLBACK_COORDS = { lat: 37.7749, lng: -122.4194 };

export function useGeolocation({ watch = false } = {}) {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | locating | success | error

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported on this device.');
      setCoords(FALLBACK_COORDS);
      setStatus('error');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('success');
      },
      (err) => {
        setError(err.message || 'Unable to retrieve location.');
        setCoords(FALLBACK_COORDS);
        setStatus('error');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    if (!watch || !('geolocation' in navigator)) return undefined;
    const id = navigator.geolocation.watchPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [watch]);

  return { coords, error, status, request, fallback: FALLBACK_COORDS };
}

import { useEffect } from 'react';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import { useGeolocation } from '../../hooks/useGeolocation';

export default function LocationPicker({ label, value, onChange, placeholder }) {
  const { status, coords, request } = useGeolocation();

  useEffect(() => {
    if (status === 'success' && coords) {
      onChange((prev) => ({ ...prev, lat: coords.lat, lng: coords.lng, label: prev?.label || 'Current location' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, coords]);

  return (
    <div>
      <label>{label}</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <MapPin size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
          <input
            style={{ paddingLeft: 36 }}
            placeholder={placeholder}
            value={value?.label || ''}
            onChange={(e) => onChange((prev) => ({ ...prev, label: e.target.value }))}
          />
        </div>
        <Button variant="subtle" onClick={request} type="button">
          {status === 'locating' ? <Loader2 size={16} className="spin" /> : <Crosshair size={16} />}
        </Button>
      </div>
      {status === 'error' && (
        <p style={{ fontSize: 12, color: 'var(--amber)', marginTop: 6 }}>Couldn't access GPS — enter the address manually.</p>
      )}
    </div>
  );
}

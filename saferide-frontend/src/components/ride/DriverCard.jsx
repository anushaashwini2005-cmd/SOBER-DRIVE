import { Star, Phone, Clock } from 'lucide-react';
import Card from '../common/Card';

export default function DriverCard({ driver }) {
  if (!driver) {
    return (
      <Card style={{ textAlign: 'center', padding: 32 }}>
        <p style={{ color: 'var(--text-faint)' }}>Waiting for a driver to accept…</p>
      </Card>
    );
  }
  return (
    <Card style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, var(--brand-hi), var(--brand))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 18, color: '#fff', fontFamily: 'var(--font-display)',
      }}>
        {driver.photoInitials}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{driver.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
          <Star size={12} fill="var(--amber)" color="var(--amber)" /> {driver.rating}
          <span>·</span> {driver.vehicle}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>Plate {driver.plate}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--location)', fontWeight: 700 }}>
          <Clock size={14} /> {driver.etaMinutes} min
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border-soft)' }}>
          <Phone size={12} /> Call
        </button>
      </div>
    </Card>
  );
}

import { Check } from 'lucide-react';
import { RIDE_STATUS_STEPS } from '../../utils/constants';

export default function RideStatusTimeline({ currentStatus }) {
  const currentIndex = RIDE_STATUS_STEPS.indexOf(currentStatus);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto', paddingBottom: 4 }}>
      {RIDE_STATUS_STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < RIDE_STATUS_STEPS.length - 1 ? 1 : 'none', minWidth: 90 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? 'var(--safe)' : active ? 'var(--location)' : 'var(--bg-elevated)',
                border: `1px solid ${done ? 'var(--safe)' : active ? 'var(--location)' : 'var(--border-soft)'}`,
                boxShadow: active ? '0 0 0 6px var(--location-glow)' : 'none',
              }}>
                {done ? <Check size={14} color="#04150a" /> : <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#fff' : 'var(--text-faint)' }}>{i + 1}</span>}
              </div>
              <span style={{ fontSize: 11, textAlign: 'center', color: active ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: active ? 700 : 500, whiteSpace: 'nowrap' }}>
                {step}
              </span>
            </div>
            {i < RIDE_STATUS_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? 'var(--safe)' : 'var(--border-soft)', margin: '0 4px', marginBottom: 18 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

import { MapPin, PhoneCall, Wallet, Car, Check, Loader2 } from 'lucide-react';
import { ESCALATION_STEPS } from '../../utils/constants';

const ICONS = { location: MapPin, contact: PhoneCall, wallet: Wallet, driver: Car };

export default function EscalationFlow({ completedSteps = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {ESCALATION_STEPS.map((step, i) => {
        const Icon = ICONS[step.key];
        const done = completedSteps.includes(step.key);
        const active = !done && completedSteps.length === i;
        const isLast = i === ESCALATION_STEPS.length - 1;

        return (
          <div key={step.key} style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                className={done ? 'check-pop' : ''}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--safe-dim)' : active ? 'var(--danger-dim)' : 'var(--bg-elevated)',
                  border: `1px solid ${done ? 'var(--safe)' : active ? 'var(--danger)' : 'var(--border-soft)'}`,
                  flexShrink: 0,
                }}
              >
                {done ? <Check size={18} color="var(--safe)" /> : active ? <Loader2 size={18} color="var(--danger)" className="spin" /> : <Icon size={16} color="var(--text-faint)" />}
              </div>
              {!isLast && (
                <div style={{ width: 2, flex: 1, minHeight: 32, background: done ? 'var(--safe)' : 'var(--border-soft)', transition: 'background 0.4s ease' }} />
              )}
            </div>
            <div style={{ paddingBottom: 28 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: done ? 'var(--text-primary)' : active ? 'var(--text-primary)' : 'var(--text-faint)' }}>
                {step.label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {done ? 'Complete' : active ? 'In progress…' : 'Pending'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

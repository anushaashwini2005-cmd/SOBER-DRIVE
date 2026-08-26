import { ShieldCheck, ShieldOff, MapPin, Users, Wallet, Clock } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function StatusOverview({ plan, secondsLeft, contact, wallet }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="eyebrow"><ShieldCheck size={13} /> Current status</div>
        {plan ? <Badge tone="safe" pulse>Plan active</Badge> : <Badge tone="muted">No active plan</Badge>}
      </div>

      {plan ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          <Stat icon={Clock} label="Time remaining" value={secondsLeft} />
          <Stat icon={MapPin} label="Destination" value={plan.destination?.label || '—'} small />
          <Stat icon={Users} label="Emergency contact" value={contact?.name || '—'} small />
          <Stat icon={Wallet} label="Reserved" value={`$${plan.walletAmount || 0}`} />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
          <ShieldOff size={18} />
          <p>You don't have an active safety plan. Create one before you head out.</p>
        </div>
      )}
    </Card>
  );
}

function Stat({ icon: Icon, label, value, small }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <Icon size={13} /> {label}
      </div>
      <div style={{ fontSize: small ? 15 : 20, fontWeight: 700, fontFamily: small ? 'var(--font-body)' : 'var(--font-mono)' }}>
        {value}
      </div>
    </div>
  );
}

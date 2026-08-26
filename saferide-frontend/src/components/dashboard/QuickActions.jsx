import { Plus, ShieldCheck, Users, Wallet, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';

const ACTIONS = [
  { icon: Plus, label: 'Create Safety Plan', to: '/create-plan', tone: 'brand' },
  { icon: ShieldCheck, label: 'Safety Monitor', to: '/safety-monitor', tone: 'safe' },
  { icon: Users, label: 'Emergency Contacts', to: '/emergency-contacts', tone: 'amber' },
  { icon: Wallet, label: 'Wallet', to: '/wallet', tone: 'location' },
];

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
      {ACTIONS.map(({ icon: Icon, label, to, tone }) => (
        <Card key={to} hover onClick={() => navigate(to)} style={{ cursor: 'pointer', textAlign: 'center', padding: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, margin: '0 auto 10px',
            background: `var(--${tone}-dim)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={18} color={`var(--${tone}${tone === 'brand' ? '-hi' : ''})`} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        </Card>
      ))}
    </div>
  );
}

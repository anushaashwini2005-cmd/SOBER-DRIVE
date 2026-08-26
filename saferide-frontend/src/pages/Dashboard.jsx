import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Sparkles } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import StatusOverview from '../components/dashboard/StatusOverview';
import QuickActions from '../components/dashboard/QuickActions';
import MapView from '../components/location/MapView';
import { useSafety } from '../context/SafetyContext';
import { useAuth } from '../context/AuthContext';
import { formatDuration } from '../hooks/useSafetyTimer';

export default function Dashboard() {
  const { user } = useAuth();
  const { plan, contacts, wallet, activity, demoMode, setDemoMode } = useSafety();
  const navigate = useNavigate();

  const contact = contacts.find((c) => c.id === plan?.contactId);
  const secondsLeft = plan ? formatDuration((plan.timerMinutes || 0) * 60) : '—';

  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 30 }}>Hey {user?.name?.split(' ')[0] || 'there'} 👋</h1>
          <p style={{ marginTop: 6 }}>Here's what your night looks like right now.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            variant={demoMode ? 'primary' : 'ghost'}
            icon={Sparkles}
            onClick={() => setDemoMode(!demoMode)}
          >
            Demo Mode {demoMode ? 'On' : 'Off'}
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/create-plan')}>Create Safety Plan</Button>
        </div>
      </div>

      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 20 }}>
        <StatusOverview plan={plan} secondsLeft={secondsLeft} contact={contact} wallet={wallet} />
        <Card>
          <div className="eyebrow" style={{ marginBottom: 14 }}><MapPin size={13} /> Current location</div>
          <MapView
            current={{ lat: 37.7749, lng: -122.4194 }}
            pickup={plan?.pickup}
            destination={plan?.destination}
            height={180}
            zoom={12}
          />
        </Card>
      </div>

      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 17, marginBottom: 14 }}>Quick actions</h3>
        <QuickActions />
      </div>

      <Card>
        <h3 style={{ fontSize: 17, marginBottom: 16 }}>Recent activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activity.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 4px', borderBottom: '1px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Badge tone={item.tone} />
                <span style={{ fontSize: 14 }}>{item.label}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </Card>

      <style>{`
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageContainer>
  );
}

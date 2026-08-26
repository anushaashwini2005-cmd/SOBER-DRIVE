import { useState } from 'react';
import { Car, MapPin, ShieldAlert, Navigation, CheckCircle2 } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import MapView from '../components/location/MapView';
import { useSafety } from '../context/SafetyContext';
import { DEMO_DRIVER } from '../utils/demoData';

const STATUSES = ['Driver Accepted', 'Driver En Route', 'Arrived', 'Ride Started', 'Completed'];

export default function DriverDashboard() {
  const { plan } = useSafety();
  const [accepted, setAccepted] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);

  const incomingRequest = {
    passenger: 'Jordan R.',
    pickup: plan?.pickup || { label: 'The Alley Bar, 5th Street', lat: 37.7749, lng: -122.4194 },
    destination: plan?.destination || { label: 'Home — 214 Maple Ave', lat: 37.7849, lng: -122.4294 },
    safetyEscalated: true,
  };

  return (
    <PageContainer style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}><Car size={13} /> Driver dashboard</div>
        <h1 style={{ fontSize: 28 }}>{DEMO_DRIVER.name}</h1>
        <p style={{ marginTop: 6 }}>{DEMO_DRIVER.vehicle} · Plate {DEMO_DRIVER.plate}</p>
      </div>

      {!accepted ? (
        <Card style={{ borderColor: 'var(--danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldAlert size={20} color="var(--danger)" />
              <span style={{ fontWeight: 700 }}>Incoming SafeRide request</span>
            </div>
            {incomingRequest.safetyEscalated && <Badge tone="danger" pulse>Safety escalation</Badge>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <Row icon={MapPin} label="Passenger" value={incomingRequest.passenger} />
            <Row icon={MapPin} label="Pickup" value={incomingRequest.pickup.label} />
            <Row icon={Navigation} label="Destination" value={incomingRequest.destination.label} />
          </div>

          <MapView pickup={incomingRequest.pickup} destination={incomingRequest.destination} height={180} />

          <Button variant="danger" size="lg" full style={{ marginTop: 20 }} onClick={() => setAccepted(true)}>
            Accept Ride
          </Button>
        </Card>
      ) : (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontWeight: 700 }}>Status: {STATUSES[statusIdx]}</span>
            <Badge tone={statusIdx === STATUSES.length - 1 ? 'safe' : 'location'} pulse={statusIdx !== STATUSES.length - 1}>
              {statusIdx === STATUSES.length - 1 ? 'Complete' : 'Active'}
            </Badge>
          </div>

          <MapView pickup={incomingRequest.pickup} destination={incomingRequest.destination} height={220} />

          <div style={{ marginTop: 20 }}>
            {statusIdx < STATUSES.length - 1 ? (
              <Button variant="primary" full icon={CheckCircle2} onClick={() => setStatusIdx((i) => Math.min(i + 1, STATUSES.length - 1))}>
                Mark as "{STATUSES[statusIdx + 1]}"
              </Button>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--safe)', fontWeight: 600 }}>Ride complete — passenger delivered safely.</p>
            )}
          </div>
        </Card>
      )}
    </PageContainer>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon size={15} color="var(--text-faint)" />
      <span style={{ fontSize: 13, color: 'var(--text-muted)', width: 90 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

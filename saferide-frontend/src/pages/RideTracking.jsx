import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ShieldCheck } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import RideStatusTimeline from '../components/ride/RideStatusTimeline';
import DriverCard from '../components/ride/DriverCard';
import MapView from '../components/location/MapView';
import { useSafety } from '../context/SafetyContext';
import { RIDE_STATUS_STEPS } from '../utils/constants';

export default function RideTracking() {
  const navigate = useNavigate();
  const { ride, plan, lastKnownLocation, demoMode, logActivity, cancelPlan } = useSafety();
  const [status, setStatus] = useState(ride?.status || 'Driver Accepted');
  const [driverPos, setDriverPos] = useState(plan?.pickup || { lat: 37.78, lng: -122.42 });

  useEffect(() => {
    if (!ride) return undefined;
    const idx = RIDE_STATUS_STEPS.indexOf(status);
    if (idx >= RIDE_STATUS_STEPS.length - 1) return undefined;
    const t = setTimeout(() => {
      setStatus(RIDE_STATUS_STEPS[idx + 1]);
    }, demoMode ? 1800 : 6000);
    return () => clearTimeout(t);
  }, [status, ride, demoMode]);

  useEffect(() => {
    if (!plan?.pickup || !plan?.destination) return undefined;
    const id = setInterval(() => {
      setDriverPos((prev) => ({
        lat: prev.lat + (plan.destination.lat - prev.lat) * 0.15,
        lng: prev.lng + (plan.destination.lng - prev.lng) * 0.15,
      }));
    }, 1500);
    return () => clearInterval(id);
  }, [plan]);

  useEffect(() => {
    if (status === 'Completed') logActivity('Ride completed — you made it home safe', 'safe');
  }, [status, logActivity]);

  if (!ride) {
    return (
      <PageContainer style={{ textAlign: 'center', paddingTop: 100 }}>
        <Car size={40} color="var(--text-faint)" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 24, marginBottom: 10 }}>No ride in progress</h2>
        <p style={{ marginBottom: 24 }}>A ride will appear here once your safety plan escalates or you request one manually.</p>
        <Button variant="primary" onClick={() => navigate('/safety-monitor')}>Go to Safety Monitor</Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}><Car size={13} /> Ride tracking</div>
        <h1 style={{ fontSize: 28 }}>You're on your way home.</h1>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <RideStatusTimeline currentStatus={status} />
      </Card>

      <div style={{ marginBottom: 20 }}>
        <DriverCard driver={ride.driver} />
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Route</div>
        <MapView
          current={status === 'Completed' ? plan?.destination : driverPos}
          pickup={plan?.pickup}
          destination={plan?.destination}
          driver={status !== 'Completed' ? driverPos : null}
          height={260}
        />
      </Card>

      {status === 'Completed' ? (
        <Card style={{ textAlign: 'center', padding: 32 }}>
          <ShieldCheck size={32} color="var(--safe)" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: 19, marginBottom: 8 }}>You made it home safe.</h3>
          <p style={{ marginBottom: 20 }}>Your safety plan has been closed out.</p>
          <Button variant="primary" onClick={() => { cancelPlan(); navigate('/dashboard'); }}>Back to Dashboard</Button>
        </Card>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Badge tone="location" pulse>Live tracking</Badge>
        </div>
      )}
    </PageContainer>
  );
}

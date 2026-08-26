import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Users, Wallet, Sparkles, BatteryWarning, Server, Navigation } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import CountdownTimer from '../components/safety/CountdownTimer';
import CheckInModal from '../components/safety/CheckInModal';
import EscalationFlow from '../components/safety/EscalationFlow';
import MapView from '../components/location/MapView';
import VoiceAssistant from '../components/voice/VoiceAssistant';
import { useSafety } from '../context/SafetyContext';
import { useSafetyTimer, formatDuration } from '../hooks/useSafetyTimer';
import { useDemoMode } from '../hooks/useDemoMode';
import { SAFETY_STATUS } from '../utils/constants';

export default function SafetyMonitor() {
  const navigate = useNavigate();
  const {
    plan, safetyStatus, contacts, escalationSteps, ride, lastKnownLocation,
    deviceConnected, setDeviceConnected,
    startCheckIn, respondSafe, requestRideNow, runEscalation, cancelPlan, setSafetyStatus,
  } = useSafety();
  const { demoMode, setDemoMode, timerSeconds, responseWindowSeconds } = useDemoMode();

  const contact = contacts.find((c) => c.id === plan?.contactId);
  const mainTotal = plan ? timerSeconds(plan.timerMinutes) : 0;

  const mainTimer = useSafetyTimer(mainTotal, {
    autoStart: !!plan && safetyStatus === SAFETY_STATUS.ACTIVE,
    onComplete: () => startCheckIn(),
  });

  const responseTimer = useSafetyTimer(responseWindowSeconds, {
    autoStart: false,
    onComplete: () => runEscalation(lastKnownLocation),
  });

  useEffect(() => {
    if (safetyStatus === SAFETY_STATUS.CHECK_IN) {
      responseTimer.reset(responseWindowSeconds);
      responseTimer.setRunning(true);
    } else {
      responseTimer.setRunning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safetyStatus]);

  useEffect(() => {
    if (safetyStatus === SAFETY_STATUS.ESCALATED && ride?.status === 'Driver Accepted') {
      const t = setTimeout(() => navigate('/ride-tracking'), 1400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [safetyStatus, ride, navigate]);

  const handleSafe = () => { respondSafe(); mainTimer.reset(mainTotal); mainTimer.setRunning(true); };
  const handleRideNow = () => { requestRideNow(); runEscalation(lastKnownLocation); };

  const handleVoiceAction = (key) => {
    if (key === 'im_safe' && safetyStatus === SAFETY_STATUS.CHECK_IN) handleSafe();
    if (key === 'request_ride') handleRideNow();
  };

  if (!plan) {
    return (
      <PageContainer style={{ textAlign: 'center', paddingTop: 100 }}>
        <ShieldCheck size={40} color="var(--text-faint)" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 24, marginBottom: 10 }}>No active safety plan</h2>
        <p style={{ marginBottom: 24 }}>Create a plan before your safety monitor can run.</p>
        <Button variant="primary" onClick={() => navigate('/create-plan')}>Create Safety Plan</Button>
      </PageContainer>
    );
  }

  const timerTone = safetyStatus === SAFETY_STATUS.ESCALATING || safetyStatus === SAFETY_STATUS.ESCALATED ? 'danger' : 'safe';

  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><ShieldCheck size={13} /> Safety monitor</div>
          <h1 style={{ fontSize: 28 }}>Safety Plan Active</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant={demoMode ? 'primary' : 'ghost'} size="sm" icon={Sparkles} onClick={() => setDemoMode(!demoMode)}>
            Demo Mode {demoMode ? 'On' : 'Off'}
          </Button>
          <Button variant="subtle" size="sm" icon={BatteryWarning} onClick={() => setDeviceConnected(!deviceConnected)}>
            {deviceConnected ? 'Simulate disconnect' : 'Reconnect device'}
          </Button>
        </div>
      </div>

      {!deviceConnected && (
        <Card style={{ marginBottom: 20, borderColor: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Server size={22} color="var(--amber)" />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--amber)' }}>Device disconnected</div>
            <p style={{ fontSize: 13, marginTop: 2 }}>
              Your phone lost connection. Your safety plan keeps running server-side, using your last known location and pre-confirmed pickup — it does not mean GPS continues transmitting from a powered-off phone.
            </p>
          </div>
        </Card>
      )}

      <div className="monitor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card style={{ textAlign: 'center', padding: 40 }}>
          {safetyStatus === SAFETY_STATUS.ESCALATING || safetyStatus === SAFETY_STATUS.ESCALATED ? (
            <>
              <Badge tone="danger" pulse>No response detected</Badge>
              <div style={{ marginTop: 20 }}>
                <EscalationFlow completedSteps={escalationSteps} />
              </div>
            </>
          ) : safetyStatus === SAFETY_STATUS.SAFE ? (
            <>
              <Badge tone="safe">You checked in safe</Badge>
              <div style={{ marginTop: 24 }}>
                <CountdownTimer secondsLeft={mainTimer.secondsLeft} totalSeconds={mainTotal} tone="safe" label="until next check-in" />
              </div>
            </>
          ) : (
            <>
              <Badge tone={timerTone} pulse>Monitoring</Badge>
              <div style={{ marginTop: 24 }}>
                <CountdownTimer secondsLeft={mainTimer.secondsLeft} totalSeconds={mainTotal} tone={timerTone} label="until check-in" />
              </div>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 26 }}>
            <Button variant="ghost" size="sm" onClick={cancelPlan}>Cancel plan</Button>
          </div>
        </Card>

        <Card>
          <div className="eyebrow" style={{ marginBottom: 14 }}><Navigation size={13} /> Live details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <DetailRow icon={MapPin} label="Pickup" value={plan.pickup?.label} />
            <DetailRow icon={MapPin} label="Destination" value={plan.destination?.label} />
            <DetailRow icon={Users} label="Emergency contact" value={contact ? `${contact.name} · ${contact.phone}` : '—'} />
            <DetailRow icon={Wallet} label="Wallet authorization" value={`$${plan.walletAmount}`} />
          </div>
          <div style={{ marginTop: 18 }}>
            <MapView pickup={plan.pickup} destination={plan.destination} current={lastKnownLocation || plan.pickup} height={170} />
          </div>
        </Card>
      </div>

      <div className="monitor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <VoiceAssistant onAction={handleVoiceAction} />
        {safetyStatus === SAFETY_STATUS.ESCALATED && ride && (
          <Card>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Ride requested</div>
            <p style={{ fontSize: 14, marginBottom: 8 }}>Status: <strong style={{ color: 'var(--text-primary)' }}>{ride.status}</strong></p>
            <Button variant="primary" full onClick={() => navigate('/ride-tracking')}>View ride tracking</Button>
          </Card>
        )}
      </div>

      <CheckInModal
        open={safetyStatus === SAFETY_STATUS.CHECK_IN}
        secondsLeft={responseTimer.secondsLeft}
        totalSeconds={responseWindowSeconds}
        onSafe={handleSafe}
        onRide={handleRideNow}
      />

      <style>{`
        @media (max-width: 900px) { .monitor-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </PageContainer>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <Icon size={15} color="var(--text-faint)" style={{ marginTop: 2 }} />
      <div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{value || '—'}</div>
      </div>
    </div>
  );
}

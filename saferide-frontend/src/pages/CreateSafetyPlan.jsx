import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Wallet, Check, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LocationPicker from '../components/location/LocationPicker';
import MapView from '../components/location/MapView';
import { useSafety } from '../context/SafetyContext';
import { TIMER_PRESETS } from '../utils/constants';

const STEPS = ['Route', 'Timer', 'Contact', 'Wallet', 'Review'];

export default function CreateSafetyPlan() {
  const navigate = useNavigate();
  const { contacts, createPlan } = useSafety();
  const [step, setStep] = useState(0);

  const [pickup, setPickup] = useState({ label: '', lat: 37.7749, lng: -122.4194 });
  const [destination, setDestination] = useState({ label: '', lat: 37.7849, lng: -122.4294 });
  const [timerMinutes, setTimerMinutes] = useState(240);
  const [contactId, setContactId] = useState(contacts[0]?.id || '');
  const [walletAmount, setWalletAmount] = useState(35);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canProceed = [
    !!pickup.label && !!destination.label,
    timerMinutes > 0,
    !!contactId,
    walletAmount >= 0,
    true,
  ][step];

  const handleActivate = () => {
    createPlan({ pickup, destination, timerMinutes, contactId, walletAmount, status: 'active' });
    navigate('/safety-monitor');
  };

  const selectedContact = contacts.find((c) => c.id === contactId);

  return (
    <PageContainer style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 30 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}><ShieldCheck size={13} /> New safety plan</div>
        <h1 style={{ fontSize: 30 }}>Set your plan while you're sober.</h1>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ flex: 1 }}>
            <div style={{ height: 4, borderRadius: 4, background: i <= step ? 'var(--brand)' : 'var(--border-soft)', marginBottom: 8, transition: 'background 0.3s ease' }} />
            <span style={{ fontSize: 11, color: i <= step ? 'var(--text-secondary)' : 'var(--text-faint)', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>

      <Card className="fade-up" key={step} style={{ minHeight: 380 }}>
        {step === 0 && (
          <div>
            <StepHeader icon={MapPin} title="Pickup & destination" subtitle="Where you're starting, and where you want to end up." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 20 }}>
              <LocationPicker label="Pickup location" value={pickup} onChange={setPickup} placeholder="Where are you starting from?" />
              <LocationPicker label="Destination" value={destination} onChange={setDestination} placeholder="Where do you want to end up?" />
            </div>
            <MapView pickup={pickup.label ? pickup : null} destination={destination.label ? destination : null} current={pickup} height={200} />
          </div>
        )}

        {step === 1 && (
          <div>
            <StepHeader icon={Clock} title="Safety timer" subtitle="If you haven't checked in by the time this runs out, we'll check on you." />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {TIMER_PRESETS.map((preset) => (
                <button
                  key={preset.minutes}
                  onClick={() => setTimerMinutes(preset.minutes)}
                  style={{
                    padding: '18px 14px', borderRadius: 12, textAlign: 'left',
                    background: timerMinutes === preset.minutes ? 'var(--brand-dim)' : 'var(--bg-elevated)',
                    border: `1px solid ${timerMinutes === preset.minutes ? 'var(--brand)' : 'var(--border-soft)'}`,
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{preset.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Check in by then</div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 18 }}>
              <label>Or set a custom duration (minutes)</label>
              <input type="number" min="1" value={timerMinutes} onChange={(e) => setTimerMinutes(Number(e.target.value))} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <StepHeader icon={Users} title="Emergency contact" subtitle="Who should we notify if your timer runs out and you don't respond?" />
            {contacts.length === 0 ? (
              <p>You don't have any contacts yet. <a href="/emergency-contacts" style={{ color: 'var(--brand-hi)', fontWeight: 600 }}>Add one</a> first.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {contacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setContactId(c.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', borderRadius: 12,
                      background: contactId === c.id ? 'var(--brand-dim)' : 'var(--bg-elevated)',
                      border: `1px solid ${contactId === c.id ? 'var(--brand)' : 'var(--border-soft)'}`,
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.relation} · {c.phone}</div>
                    </div>
                    {contactId === c.id && <Check size={18} color="var(--brand-hi)" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <StepHeader icon={Wallet} title="Wallet amount" subtitle="Prepaid amount authorized only if your plan escalates." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 40, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>${walletAmount}</span>
            </div>
            <input type="range" min="10" max="100" step="5" value={walletAmount} onChange={(e) => setWalletAmount(Number(e.target.value))} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-faint)', marginTop: 8 }}>
              <span>$10</span><span>$100</span>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <StepHeader icon={ShieldCheck} title="Review & activate" subtitle="Double-check the details, then activate your plan." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ReviewRow label="Pickup" value={pickup.label} />
              <ReviewRow label="Destination" value={destination.label} />
              <ReviewRow label="Timer" value={`${timerMinutes} minutes`} />
              <ReviewRow label="Emergency contact" value={selectedContact ? `${selectedContact.name} (${selectedContact.phone})` : '—'} />
              <ReviewRow label="Wallet reserve" value={`$${walletAmount}`} />
            </div>
          </div>
        )}
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <Button variant="ghost" icon={ArrowLeft} onClick={back} disabled={step === 0}>Back</Button>
        {step < STEPS.length - 1 ? (
          <Button variant="primary" icon={ArrowRight} iconRight onClick={next} disabled={!canProceed}>Continue</Button>
        ) : (
          <Button variant="safe" icon={ShieldCheck} onClick={handleActivate}>Activate Safety Plan</Button>
        )}
      </div>
    </PageContainer>
  );
}

function StepHeader({ icon: Icon, title, subtitle }) {
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color="var(--brand-hi)" />
      </div>
      <div>
        <h3 style={{ fontSize: 19 }}>{title}</h3>
        <p style={{ fontSize: 13, marginTop: 3 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-soft)' }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{value || '—'}</span>
    </div>
  );
}

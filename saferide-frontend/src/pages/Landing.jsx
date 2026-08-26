import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, MapPin, PhoneCall, Wallet, Mic, ArrowRight, Play } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import CountdownTimer from '../components/safety/CountdownTimer';

const STEPS = [
  { icon: ShieldCheck, title: 'Plan while sober', body: 'Set your pickup, destination, safety timer, emergency contact, and prepaid amount before the night starts.' },
  { icon: Zap, title: 'We watch, quietly', body: "Your plan runs in the background. No app-checking, no decisions required once you're out." },
  { icon: PhoneCall, title: 'We act if you can\'t', body: "If your timer runs out and you don't check in, SafeRide notifies your contact and gets you a ride automatically." },
];

const FEATURES = [
  { icon: MapPin, label: 'Live location handoff', tone: 'location' },
  { icon: PhoneCall, label: 'Automatic contact alert', tone: 'danger' },
  { icon: Wallet, label: 'Prepaid ride wallet', tone: 'amber' },
  { icon: Mic, label: 'Hands-free voice control', tone: 'brand' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* Hero */}
      <section className="container" style={{ paddingTop: 90, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56, alignItems: 'center' }} className="hero-grid">
          <div className="fade-up">
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              <ShieldCheck size={13} /> Proactive safety, not reactive rides
            </div>
            <h1 style={{ fontSize: 56, lineHeight: 1.05, marginBottom: 22 }}>
              Your safety plan<br />doesn't stop when<br />you do.
            </h1>
            <p style={{ fontSize: 18, maxWidth: 480, marginBottom: 34 }}>
              Most ride apps wait for you to request a ride. SafeRide acts when you may no longer be able to.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button variant="primary" size="lg" icon={ArrowRight} iconRight onClick={() => navigate('/register')}>
                Create Safety Plan
              </Button>
              <Button variant="ghost" size="lg" icon={Play} onClick={() => navigate('/register')}>
                Try Demo Mode
              </Button>
            </div>
          </div>

          <div className="float" style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: 320, textAlign: 'center', padding: 36 }}>
              <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 20 }}>Safety plan active</div>
              <CountdownTimer secondsLeft={162 * 60} totalSeconds={240 * 60} tone="safe" size={200} label="until check-in" />
              <p style={{ marginTop: 20, fontSize: 13 }}>Destination: Home — 214 Maple Ave</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container" style={{ padding: '60px 0' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>How it works</div>
        <h2 style={{ fontSize: 32, marginBottom: 36 }}>Three moments, one continuous plan.</h2>
        <div className="grid stagger" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <Card key={title} hover>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', fontSize: 13 }}>0{i + 1}</span>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--brand-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color="var(--brand-hi)" />
                </div>
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14 }}>{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* USP comparison */}
      <section className="container" style={{ padding: '60px 0' }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Card style={{ opacity: 0.6 }}>
            <div className="eyebrow" style={{ color: 'var(--text-muted)', marginBottom: 14 }}>Traditional ride apps</div>
            <p style={{ fontSize: 15 }}>Wait for you to open the app, type an address, and tap request — every time, even if you're not in a state to.</p>
          </Card>
          <Card style={{ borderColor: 'var(--brand)', boxShadow: '0 0 0 1px var(--brand-dim)' }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>SafeRide</div>
            <p style={{ fontSize: 15, color: 'var(--text-primary)' }}>Your plan is already set. If you go quiet, we take the next step for you — automatically, and immediately.</p>
          </Card>
        </div>
      </section>

      {/* Feature strip */}
      <section className="container" style={{ padding: '40px 0 80px' }}>
        <div className="grid stagger" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {FEATURES.map(({ icon: Icon, label, tone }) => (
            <Card key={label} style={{ textAlign: 'center', padding: 22 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, margin: '0 auto 12px',
                background: `var(--${tone}-dim)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={17} color={`var(--${tone}${tone === 'brand' ? '-hi' : ''})`} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ paddingBottom: 100 }}>
        <Card style={{ textAlign: 'center', padding: '56px 32px', background: 'linear-gradient(135deg, #1a1440, #12172a)' }}>
          <h2 style={{ fontSize: 30, marginBottom: 14 }}>Set your plan before you need it.</h2>
          <p style={{ maxWidth: 460, margin: '0 auto 28px' }}>Takes under two minutes. Runs quietly in the background all night.</p>
          <Button variant="primary" size="lg" icon={ArrowRight} iconRight onClick={() => navigate('/register')}>
            Create your safety plan
          </Button>
        </Card>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .grid[style*="repeat(3"] { grid-template-columns: 1fr !important; }
          .grid[style*="repeat(4"] { grid-template-columns: 1fr 1fr !important; }
          .grid[style*="1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

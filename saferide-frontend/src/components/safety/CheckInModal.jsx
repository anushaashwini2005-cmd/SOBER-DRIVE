import { AlertTriangle, Check, Car } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import CountdownTimer from './CountdownTimer';
import { formatDuration } from '../../hooks/useSafetyTimer';

export default function CheckInModal({ open, secondsLeft, totalSeconds, onSafe, onRide }) {
  return (
    <Modal open={open} onClose={() => {}} width={420}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', margin: '0 auto 16px',
          background: 'var(--amber-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AlertTriangle size={24} color="var(--amber)" />
        </div>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Are you safe?</h2>
        <p style={{ marginBottom: 24 }}>
          Your safety timer just ended. Let us know you're okay, or get a ride now.
        </p>

        <div style={{ margin: '0 auto 24px' }}>
          <CountdownTimer secondsLeft={secondsLeft} totalSeconds={totalSeconds} tone="amber" size={160} label="responding in" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="safe" size="lg" icon={Check} full onClick={onSafe}>I'm Safe</Button>
          <Button variant="danger" size="lg" icon={Car} full onClick={onRide}>Get My Ride</Button>
        </div>
        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-faint)' }}>
          No response in {formatDuration(totalSeconds)} triggers your safety escalation automatically.
        </p>
      </div>
    </Modal>
  );
}

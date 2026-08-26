import { formatDuration } from '../../hooks/useSafetyTimer';

const TONE_COLORS = {
  safe: 'var(--safe)',
  amber: 'var(--amber)',
  danger: 'var(--danger)',
  brand: 'var(--brand-hi)',
};

export default function CountdownTimer({ secondsLeft, totalSeconds, tone = 'safe', size = 260, label }) {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const dashOffset = circumference * (1 - progress);
  const color = TONE_COLORS[tone] || TONE_COLORS.safe;

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border-soft)" strokeWidth={10} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: size > 200 ? 46 : 30, fontWeight: 600,
          color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums',
        }}>
          {formatDuration(secondsLeft)}
        </div>
        {label && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {label}
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute', inset: -6, borderRadius: '50%',
          boxShadow: `0 0 0 0 ${color}55`,
          animation: secondsLeft <= 10 ? 'pulseRing 1.4s ease-out infinite' : 'none',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

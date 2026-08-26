const TONES = {
  safe: { bg: 'var(--safe-dim)', color: 'var(--safe)', dot: 'var(--safe)' },
  amber: { bg: 'var(--amber-dim)', color: 'var(--amber)', dot: 'var(--amber)' },
  danger: { bg: 'var(--danger-dim)', color: 'var(--danger)', dot: 'var(--danger)' },
  location: { bg: 'var(--location-dim)', color: 'var(--location)', dot: 'var(--location)' },
  muted: { bg: 'var(--bg-elevated)', color: 'var(--text-secondary)', dot: 'var(--text-muted)' },
  brand: { bg: 'var(--brand-dim)', color: 'var(--brand-hi)', dot: 'var(--brand-hi)' },
};

export default function Badge({ children, tone = 'muted', pulse = false }) {
  const t = TONES[tone] || TONES.muted;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: t.bg,
        color: t.color,
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: t.dot,
          animation: pulse ? 'glowPulse 1.6s ease-in-out infinite' : 'none',
        }}
      />
      {children}
    </span>
  );
}

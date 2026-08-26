export default function Card({ children, style, className = '', hover = false, ...rest }) {
  return (
    <div
      className={`card ${className}`}
      style={{
        transition: hover ? 'transform 0.2s ease, border-color 0.2s ease' : undefined,
        ...style,
      }}
      onMouseEnter={hover ? (e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; } : undefined}
      onMouseLeave={hover ? (e) => { e.currentTarget.style.borderColor = 'var(--border-soft)'; } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight,
  full = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  const styles = {
    primary: { background: 'linear-gradient(135deg, var(--brand-hi), var(--brand))', color: '#fff', border: '1px solid transparent' },
    safe: { background: 'linear-gradient(135deg, #34d478, var(--safe))', color: '#06210f', border: '1px solid transparent' },
    danger: { background: 'linear-gradient(135deg, #f76a6a, var(--danger))', color: '#2a0808', border: '1px solid transparent' },
    ghost: { background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-strong)' },
    subtle: { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-soft)' },
  };
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 13, borderRadius: 'var(--radius-sm)' },
    md: { padding: '12px 20px', fontSize: 15, borderRadius: 'var(--radius-sm)' },
    lg: { padding: '16px 28px', fontSize: 16, borderRadius: 12 },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        ...styles[variant],
        ...sizes[size],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontWeight: 600,
        width: full ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 0.12s ease, filter 0.12s ease',
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      {...rest}
    >
      {Icon && !iconRight && <Icon size={size === 'lg' ? 20 : 17} />}
      {children}
      {Icon && iconRight && <Icon size={size === 'lg' ? 20 : 17} />}
    </button>
  );
}

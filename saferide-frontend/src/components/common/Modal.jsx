export default function Modal({ open, onClose, children, width = 460 }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(4, 6, 14, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
      className="fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card fade-up"
        style={{ width: '100%', maxWidth: width, maxHeight: '86vh', overflowY: 'auto' }}
      >
        {children}
      </div>
    </div>
  );
}

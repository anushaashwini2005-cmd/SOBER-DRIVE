import { Phone, Pencil, Trash2, User } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function ContactCard({ contact, primary, onEdit, onDelete }) {
  return (
    <Card hover style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
        background: 'var(--brand-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, color: 'var(--brand-hi)', fontFamily: 'var(--font-display)',
      }}>
        {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600 }}>{contact.name}</span>
          {primary && <Badge tone="brand">Primary</Badge>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 13, color: 'var(--text-muted)' }}>
          <User size={12} /> {contact.relation}
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <Phone size={12} /> {contact.phone}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => onEdit(contact)} style={{ padding: 8, borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
          <Pencil size={14} color="var(--text-secondary)" />
        </button>
        <button onClick={() => onDelete(contact.id)} style={{ padding: 8, borderRadius: 8, background: 'var(--danger-dim)', border: '1px solid var(--border-soft)' }}>
          <Trash2 size={14} color="var(--danger)" />
        </button>
      </div>
    </Card>
  );
}

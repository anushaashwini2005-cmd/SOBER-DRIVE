import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { X } from 'lucide-react';

export default function ContactForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', relation: '', phone: '' });

  useEffect(() => { setForm(initial || { name: '', relation: '', phone: '' }); }, [initial]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 19 }}>{initial ? 'Edit contact' : 'Add emergency contact'}</h3>
        <button onClick={onCancel}><X size={20} color="var(--text-muted)" /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label>Full name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Maya Chen" />
        </div>
        <div>
          <label>Relationship</label>
          <input value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} placeholder="e.g. Roommate" />
        </div>
        <div>
          <label>Phone number</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
        <Button variant="ghost" full onClick={onCancel}>Cancel</Button>
        <Button variant="primary" full disabled={!form.name || !form.phone} onClick={() => onSave(form)}>
          Save contact
        </Button>
      </div>
    </div>
  );
}

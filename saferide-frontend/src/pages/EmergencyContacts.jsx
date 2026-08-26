import { useState } from 'react';
import { Plus, Users, PhoneOutgoing, MapPin } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ContactCard from '../components/emergency/ContactCard';
import ContactForm from '../components/emergency/ContactForm';
import { useSafety } from '../context/SafetyContext';
import { SAFETY_STATUS } from '../utils/constants';

export default function EmergencyContacts() {
  const { contacts, addContact, updateContact, deleteContact, plan, safetyStatus, lastKnownLocation } = useSafety();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSave = async (form) => {
    if (editing) await updateContact(editing.id, form);
    else await addContact(form);
    setOpen(false);
    setEditing(null);
  };

  const escalated = safetyStatus === SAFETY_STATUS.ESCALATING || safetyStatus === SAFETY_STATUS.ESCALATED;
  const primaryContact = contacts.find((c) => c.id === plan?.contactId);

  return (
    <PageContainer style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}><Users size={13} /> Emergency contacts</div>
          <h1 style={{ fontSize: 28 }}>Who we notify if you need us</h1>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => { setEditing(null); setOpen(true); }}>Add contact</Button>
      </div>

      {escalated && primaryContact && (
        <Card style={{ marginBottom: 20, borderColor: 'var(--danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <PhoneOutgoing size={18} color="var(--danger)" />
            <span style={{ fontWeight: 700, color: 'var(--danger)' }}>Emergency contact notified</span>
            <Badge tone="danger" pulse>Live</Badge>
          </div>
          <p style={{ fontSize: 14 }}>
            {primaryContact.name} has been sent your location and safety plan details.
          </p>
          {lastKnownLocation && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 13, color: 'var(--text-muted)' }}>
              <MapPin size={13} /> Sharing location: {lastKnownLocation.lat.toFixed(4)}, {lastKnownLocation.lng.toFixed(4)}
            </div>
          )}
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {contacts.length === 0 && (
          <Card style={{ textAlign: 'center', padding: 40 }}>
            <p>No emergency contacts yet. Add one so SafeRide knows who to notify.</p>
          </Card>
        )}
        {contacts.map((c) => (
          <ContactCard
            key={c.id}
            contact={c}
            primary={c.id === plan?.contactId}
            onEdit={(contact) => { setEditing(contact); setOpen(true); }}
            onDelete={deleteContact}
          />
        ))}
      </div>

      <Modal open={open} onClose={() => { setOpen(false); setEditing(null); }}>
        <ContactForm initial={editing} onSave={handleSave} onCancel={() => { setOpen(false); setEditing(null); }} />
      </Modal>
    </PageContainer>
  );
}

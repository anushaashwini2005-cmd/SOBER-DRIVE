import api, { withFallback } from './api';
import { DEMO_CONTACTS } from '../utils/demoData';

export const emergencyService = {
  getContacts: (userId) =>
    withFallback(api.get(`/emergency/${userId}/contacts`), DEMO_CONTACTS),

  addContact: (userId, contact) =>
    withFallback(api.post(`/emergency/${userId}/contacts`, contact), { ...contact, id: `c-${Date.now()}` }),

  updateContact: (userId, contactId, updates) =>
    withFallback(api.put(`/emergency/${userId}/contacts/${contactId}`, updates), { id: contactId, ...updates }),

  deleteContact: (userId, contactId) =>
    withFallback(api.delete(`/emergency/${userId}/contacts/${contactId}`), { ok: true }),

  notify: (contactId, payload) =>
    withFallback(api.post(`/emergency/notify/${contactId}`, payload), { ok: true, notifiedAt: new Date().toISOString() }),
};

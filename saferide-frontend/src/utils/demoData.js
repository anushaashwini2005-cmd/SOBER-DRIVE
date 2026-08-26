export const DEMO_USER = {
  id: 'demo-user-1',
  name: 'Jordan Rivera',
  email: 'jordan@demo.saferide.app',
};

export const DEMO_CONTACTS = [
  { id: 'c1', name: 'Maya Chen', relation: 'Roommate', phone: '+1 (555) 010-2231' },
  { id: 'c2', name: 'Sam Ortega', relation: 'Sibling', phone: '+1 (555) 019-8844' },
];

export const DEMO_PLAN = {
  pickup: { label: 'The Alley Bar, 5th Street', lat: 37.7749, lng: -122.4194 },
  destination: { label: 'Home — 214 Maple Ave', lat: 37.7849, lng: -122.4294 },
  timerMinutes: 240,
  contactId: 'c1',
  walletAmount: 35,
};

export const DEMO_DRIVER = {
  id: 'd1',
  name: 'Alicia Ferreira',
  rating: 4.93,
  vehicle: 'Toyota Camry · Silver',
  plate: 'SR-4821',
  photoInitials: 'AF',
  etaMinutes: 6,
  phone: '+1 (555) 044-7712',
};

export const DEMO_WALLET = {
  balance: 82.5,
  transactions: [
    { id: 't1', label: 'Wallet top-up', amount: 50, type: 'credit', date: '2026-08-18' },
    { id: 't2', label: 'Wallet top-up', amount: 40, type: 'credit', date: '2026-08-10' },
    { id: 't3', label: 'Ride — Downtown to Home', amount: -18.5, type: 'debit', date: '2026-08-09' },
    { id: 't4', label: 'Wallet top-up', amount: 20, type: 'credit', date: '2026-08-02' },
  ],
};

export const DEMO_ACTIVITY = [
  { id: 'a1', label: 'Safety plan completed successfully', time: 'Fri, 11:52 PM', tone: 'safe' },
  { id: 'a2', label: 'Emergency contact updated', time: 'Wed, 4:10 PM', tone: 'muted' },
  { id: 'a3', label: 'Wallet topped up · $40.00', time: 'Mon, 7:02 PM', tone: 'muted' },
];

export const API_BASE_URL = 'http://localhost:8000/api';

export const SAFETY_STATUS = {
  IDLE: 'idle',
  ACTIVE: 'active',
  CHECK_IN: 'check_in',
  SAFE: 'safe',
  ESCALATING: 'escalating',
  ESCALATED: 'escalated',
};

export const RIDE_STATUS_STEPS = [
  'Requested',
  'Driver Accepted',
  'Driver En Route',
  'Arrived',
  'Ride Started',
  'Completed',
];

export const ESCALATION_STEPS = [
  { key: 'location', label: 'Location secured' },
  { key: 'contact', label: 'Emergency contact notified' },
  { key: 'wallet', label: 'Wallet authorized' },
  { key: 'driver', label: 'Driver requested' },
];

export const TIMER_PRESETS = [
  { label: '1 hour', minutes: 60 },
  { label: '2 hours', minutes: 120 },
  { label: '4 hours', minutes: 240 },
  { label: '6 hours', minutes: 360 },
];

export const DEMO_TIMER_SECONDS = 5;
export const DEMO_RESPONSE_WINDOW_SECONDS = 5;
export const CHECK_IN_RESPONSE_WINDOW_SECONDS = 90;

export const STORAGE_KEYS = {
  AUTH: 'saferide_auth',
  SAFETY_PLAN: 'saferide_safety_plan',
  WALLET: 'saferide_wallet',
  CONTACTS: 'saferide_contacts',
  DEMO_MODE: 'saferide_demo_mode',
};

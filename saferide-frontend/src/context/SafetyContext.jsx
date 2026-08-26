import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { STORAGE_KEYS, SAFETY_STATUS } from '../utils/constants';
import { DEMO_CONTACTS, DEMO_WALLET, DEMO_ACTIVITY } from '../utils/demoData';
import { emergencyService } from '../services/emergencyService';
import { walletService } from '../services/walletService';
import { rideService } from '../services/rideService';
import { useAuth } from './AuthContext';

const SafetyContext = createContext(null);

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function SafetyProvider({ children }) {
  const { user } = useAuth();

  const [plan, setPlan] = useState(() => loadJSON(STORAGE_KEYS.SAFETY_PLAN, null));
  const [safetyStatus, setSafetyStatus] = useState(plan ? SAFETY_STATUS.ACTIVE : SAFETY_STATUS.IDLE);
  const [demoMode, setDemoMode] = useState(() => loadJSON(STORAGE_KEYS.DEMO_MODE, false));
  const [contacts, setContacts] = useState(() => loadJSON(STORAGE_KEYS.CONTACTS, DEMO_CONTACTS));
  const [wallet, setWallet] = useState(() => loadJSON(STORAGE_KEYS.WALLET, DEMO_WALLET));
  const [escalationSteps, setEscalationSteps] = useState([]);
  const [ride, setRide] = useState(null);
  const [activity, setActivity] = useState(DEMO_ACTIVITY);
  const [lastKnownLocation, setLastKnownLocation] = useState(null);
  const [deviceConnected, setDeviceConnected] = useState(true);

  useEffect(() => {
    if (plan) localStorage.setItem(STORAGE_KEYS.SAFETY_PLAN, JSON.stringify(plan));
    else localStorage.removeItem(STORAGE_KEYS.SAFETY_PLAN);
  }, [plan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, JSON.stringify(demoMode));
  }, [demoMode]);

  const logActivity = useCallback((label, tone = 'muted') => {
    setActivity((prev) => [
      { id: `a-${Date.now()}`, label, time: 'Just now', tone },
      ...prev,
    ].slice(0, 8));
  }, []);

  const createPlan = useCallback((planDraft) => {
    const newPlan = { ...planDraft, id: `plan-${Date.now()}`, createdAt: new Date().toISOString() };
    setPlan(newPlan);
    setSafetyStatus(SAFETY_STATUS.ACTIVE);
    setEscalationSteps([]);
    setRide(null);
    logActivity('Safety plan activated', 'safe');
    return newPlan;
  }, [logActivity]);

  const cancelPlan = useCallback(() => {
    setPlan(null);
    setSafetyStatus(SAFETY_STATUS.IDLE);
    setEscalationSteps([]);
    setRide(null);
    logActivity('Safety plan cancelled', 'muted');
  }, [logActivity]);

  const startCheckIn = useCallback(() => {
    setSafetyStatus(SAFETY_STATUS.CHECK_IN);
  }, []);

  const respondSafe = useCallback(() => {
    setSafetyStatus(SAFETY_STATUS.SAFE);
    logActivity('Checked in — marked safe', 'safe');
  }, [logActivity]);

  const requestRideNow = useCallback(() => {
    setSafetyStatus(SAFETY_STATUS.SAFE);
    logActivity('Ride requested manually', 'safe');
  }, [logActivity]);

  const runEscalation = useCallback(async (coords) => {
    setSafetyStatus(SAFETY_STATUS.ESCALATING);
    setEscalationSteps([]);
    logActivity('No response detected — escalation started', 'danger');

    const finalCoords = coords || { lat: 37.7749, lng: -122.4194 };
    setLastKnownLocation(finalCoords);
    setEscalationSteps((s) => [...s, 'location']);
    await new Promise((r) => setTimeout(r, demoMode ? 700 : 1500));

    const contact = contacts.find((c) => c.id === plan?.contactId) || contacts[0];
    if (contact) {
      await emergencyService.notify(contact.id, { coords: finalCoords, planId: plan?.id });
      logActivity(`Emergency contact ${contact.name} notified`, 'danger');
    }
    setEscalationSteps((s) => [...s, 'contact']);
    await new Promise((r) => setTimeout(r, demoMode ? 700 : 1500));

    if (plan?.walletAmount) {
      await walletService.authorize(user?.id, plan.walletAmount);
      logActivity(`Wallet authorized — $${plan.walletAmount}`, 'amber');
    }
    setEscalationSteps((s) => [...s, 'wallet']);
    await new Promise((r) => setTimeout(r, demoMode ? 700 : 1500));

    const newRide = await rideService.requestRide(plan?.id);
    setRide(newRide);
    setEscalationSteps((s) => [...s, 'driver']);
    logActivity('Driver requested', 'danger');
    setSafetyStatus(SAFETY_STATUS.ESCALATED);

    await new Promise((r) => setTimeout(r, demoMode ? 900 : 3000));
    const accepted = await rideService.acceptRide(newRide.id);
    setRide(accepted);
    logActivity(`Driver ${accepted.driver?.name || ''} accepted the ride`, 'safe');
  }, [contacts, plan, demoMode, user, logActivity]);

  const addContact = useCallback(async (contact) => {
    const saved = await emergencyService.addContact(user?.id, contact);
    setContacts((prev) => [...prev, saved]);
    return saved;
  }, [user]);

  const updateContact = useCallback(async (id, updates) => {
    const saved = await emergencyService.updateContact(user?.id, id, updates);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...saved } : c)));
    return saved;
  }, [user]);

  const deleteContact = useCallback(async (id) => {
    await emergencyService.deleteContact(user?.id, id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, [user]);

  const addFunds = useCallback(async (amount) => {
    const tx = await walletService.addFunds(user?.id, amount);
    setWallet((prev) => ({
      balance: Number((prev.balance + amount).toFixed(2)),
      transactions: [tx, ...prev.transactions],
    }));
    logActivity(`Wallet topped up · $${amount.toFixed(2)}`, 'muted');
  }, [user, logActivity]);

  const value = {
    plan, safetyStatus, demoMode, contacts, wallet, escalationSteps, ride,
    activity, lastKnownLocation, deviceConnected,
    setDemoMode, setSafetyStatus, setDeviceConnected,
    createPlan, cancelPlan, startCheckIn, respondSafe, requestRideNow,
    runEscalation, addContact, updateContact, deleteContact, addFunds, logActivity,
  };

  return <SafetyContext.Provider value={value}>{children}</SafetyContext.Provider>;
}

export function useSafety() {
  const ctx = useContext(SafetyContext);
  if (!ctx) throw new Error('useSafety must be used within SafetyProvider');
  return ctx;
}

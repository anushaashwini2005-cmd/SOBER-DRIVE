import api, { withFallback } from './api';
import { DEMO_WALLET } from '../utils/demoData';

export const walletService = {
  getWallet: (userId) =>
    withFallback(api.get(`/wallet/${userId}`), DEMO_WALLET),

  addFunds: (userId, amount) =>
    withFallback(api.post(`/wallet/${userId}/add`, { amount }), {
      id: `t-${Date.now()}`,
      label: 'Wallet top-up',
      amount,
      type: 'credit',
      date: new Date().toISOString().slice(0, 10),
    }),

  authorize: (userId, amount) =>
    withFallback(api.post(`/wallet/${userId}/authorize`, { amount }), { ok: true, authorized: amount }),
};

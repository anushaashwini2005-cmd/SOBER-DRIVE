import api, { withFallback } from './api';

export const safetyService = {
  createPlan: (plan) =>
    withFallback(api.post('/safety/plans', plan), { ...plan, id: `plan-${Date.now()}`, status: 'active' }),

  getActivePlan: () =>
    withFallback(api.get('/safety/plans/active'), null),

  checkIn: (planId, response) =>
    withFallback(api.post(`/safety/plans/${planId}/check-in`, { response }), { ok: true, response }),

  escalate: (planId) =>
    withFallback(api.post(`/safety/plans/${planId}/escalate`), { ok: true, escalated: true }),

  cancelPlan: (planId) =>
    withFallback(api.delete(`/safety/plans/${planId}`), { ok: true }),
};

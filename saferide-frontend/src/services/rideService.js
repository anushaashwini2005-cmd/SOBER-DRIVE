import api, { withFallback } from './api';
import { DEMO_DRIVER } from '../utils/demoData';

export const rideService = {
  requestRide: (planId) =>
    withFallback(api.post('/rides', { planId }), {
      id: `ride-${Date.now()}`,
      status: 'Requested',
      driver: null,
    }),

  acceptRide: (rideId) =>
    withFallback(api.post(`/rides/${rideId}/accept`), { id: rideId, status: 'Driver Accepted', driver: DEMO_DRIVER }),

  getRideStatus: (rideId) =>
    withFallback(api.get(`/rides/${rideId}`), { id: rideId, status: 'Driver En Route', driver: DEMO_DRIVER }),

  updateStatus: (rideId, status) =>
    withFallback(api.put(`/rides/${rideId}/status`, { status }), { id: rideId, status }),
};

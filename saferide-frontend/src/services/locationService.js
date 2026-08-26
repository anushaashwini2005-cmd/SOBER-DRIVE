import api, { withFallback } from './api';

export const locationService = {
  getLastKnown: (userId) =>
    withFallback(api.get(`/location/${userId}/last-known`), null),

  updateLocation: (userId, coords) =>
    withFallback(api.post(`/location/${userId}`, coords), { ok: true, coords }),

  reverseGeocode: async (lat, lng) => {
    // Uses browser-side lookup only when a backend isn't available;
    // for the hackathon demo we just format the coordinates.
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  },
};

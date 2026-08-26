# SafeRide — Frontend

A proactive drunk-safety ride platform built for a hackathon demo.
"Most ride apps wait for you to request a ride. SafeRide acts when you may no longer be able to."

## Stack
React + Vite, React Router, Axios, Leaflet / React Leaflet, Lucide React, Web Speech API.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Backend

`src/services/api.js` points to `http://localhost:8000/api`, ready for a future
FastAPI + MongoDB backend. Every service call falls back to local mock/demo data
automatically if that backend isn't running, so the full app works standalone.

## Demo Mode

Toggle **Demo Mode** on the Dashboard or Safety Monitor screen. It compresses the
safety timer and check-in response window down to 5 seconds each, so the full
"dead-man's party timer" escalation — check-in → no response → location secured →
emergency contact notified → wallet authorized → driver requested → accepted →
ride tracking — can be demonstrated in under 30 seconds.

## Key flow to show at a demo

1. Register (any email/password — it's local-only for the demo).
2. Turn on Demo Mode.
3. **Create Safety Plan** → fill the 5 steps → Activate.
4. You land on **Safety Monitor** — watch the 5-second timer run out.
5. Don't click anything on the "Are you safe?" prompt — after 5 more seconds it
   escalates automatically and walks through the full flow, ending on Ride Tracking.
6. Optionally open `/driver` in another tab to show the driver-side accept flow.

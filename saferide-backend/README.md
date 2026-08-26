# SafeRide — Backend

A proactive safety ride platform backend. FastAPI + MongoDB (PyMongo) + JWT auth.
The **backend is the source of truth for the safety timer** — `expires_at` is
computed and stored server-side, and every read re-checks server time before
trusting a plan's status. The frontend's countdown is cosmetic only.

## 1. Final folder structure

```
backend/
├── app/
│   ├── main.py
│   ├── config/
│   │   ├── database.py        # PyMongo client, collections, indexes
│   │   └── settings.py        # env-driven settings
│   ├── models/                # Mongo document builders/serializers
│   │   ├── user.py
│   │   ├── safety_plan.py
│   │   ├── location.py
│   │   ├── emergency_contact.py
│   │   ├── wallet.py
│   │   └── ride.py
│   ├── schemas/                # Pydantic request/response models
│   │   ├── auth.py
│   │   ├── safety.py
│   │   ├── location.py
│   │   ├── emergency.py
│   │   ├── wallet.py
│   │   └── ride.py
│   ├── routes/                 # thin HTTP layer -> services
│   │   ├── auth.py
│   │   ├── safety.py
│   │   ├── location.py
│   │   ├── emergency.py
│   │   ├── wallet.py
│   │   ├── ride.py
│   │   └── demo.py             # demo data seeding (extra, DEMO_MODE only)
│   ├── services/                # business logic
│   │   ├── safety_service.py    # state machine + escalation orchestration
│   │   ├── location_service.py
│   │   ├── emergency_service.py
│   │   ├── wallet_service.py
│   │   └── ride_service.py
│   └── utils/
│       ├── security.py          # bcrypt hashing + JWT
│       └── constants.py         # status enums, mock driver
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## 2. Installation commands

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## 3. MongoDB setup

Any of these work — just point `MONGO_URI` at it:

- **Local MongoDB**: install and run `mongod` locally, keep the default
  `MONGO_URI=mongodb://localhost:27017`.
- **Docker**: `docker run -d -p 27017:27017 --name saferide-mongo mongo:7`
- **MongoDB Atlas** (free tier): create a cluster, get the connection string,
  set `MONGO_URI=mongodb+srv://...` in `.env`.

The `saferide` database and its 8 collections are created automatically on
first write — no manual schema setup needed. Indexes are created on startup.

## 4. Environment variables

Copy `.env.example` to `.env` and fill in real values before running:

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `DB_NAME` | Database name (`saferide`) |
| `JWT_SECRET` | Secret used to sign JWTs — change this in any real deployment |
| `JWT_ALGORITHM` | JWT signing algorithm (`HS256`) |
| `JWT_EXPIRE_MINUTES` | Access token lifetime |
| `FRONTEND_ORIGIN` | Allowed CORS origin for the React frontend |
| `DEMO_MODE` | When `true`, shortens the no-response grace period for fast demos |
| `DEMO_TIMER_SECONDS` | Suggested timer length for the frontend to use in demo mode |
| `DEFAULT_TIMER_MINUTES` | Fallback timer length outside demo mode |

## 5. Run command

```bash
uvicorn app.main:app --reload
```

Runs on `http://localhost:8000` by default.

## 6. Swagger URL

**http://localhost:8000/docs** (interactive OpenAPI UI — also `/redoc` for
the alternate view).

## 7. API testing sequence

Fastest path — seed demo data in one call:

```bash
curl -X POST http://localhost:8000/api/demo/seed
```

This returns an `access_token`, a demo user with an emergency contact, and
a wallet pre-loaded with ₹500. Use that token as `Authorization: Bearer <token>`
for everything below. Or walk through it manually:

1. **Register**: `POST /api/auth/register` — `{name, email, password}` → returns `access_token`
2. **Login** (alt): `POST /api/auth/login` — `{email, password}`
3. **Add emergency contact**: `POST /api/emergency/contact` — `{name, phone, relationship}`
4. **Add wallet funds**: `POST /api/wallet/add` — `{amount: 500}`
5. **Create safety plan**: `POST /api/safety-plan` —
   `{pickup: {label, lat, lng}, destination: {label, lat, lng}, timer_minutes: 0.1, wallet_amount: 200}`
   (use a fractional minute like `0.1` ≈ 6s, or wire the frontend's demo 5s timer to call this with a short value)
6. **Poll status**: `GET /api/safety-plan/current` — watch `status` move
   `ACTIVE → CHECK_IN` once `expires_at` passes, and `seconds_remaining` count down
7. **Either**:
   - Respond in time: `POST /api/safety-plan/{id}/respond` — `{response: "SAFE"}` or `{response: "RIDE"}`
   - Do nothing: after the grace period, the next `GET /api/safety-plan/current`
     (or `POST /api/safety-plan/{id}/escalate`) auto-transitions
     `CHECK_IN → NO_RESPONSE → ESCALATING → RIDE_REQUESTED`
8. **Check the ride**: `GET /api/rides/current` → mock driver **Arjun**, `KA 01 AB 1234`, ETA 8 min
9. **Accept/start/complete**: `POST /api/rides/{id}/accept` → `/start` → `/complete`
10. **Check wallet**: `GET /api/wallet` and `GET /api/wallet/transactions` to see the reserved amount

## 8. Frontend API base URL

```
http://localhost:8000
```

CORS is restricted to `FRONTEND_ORIGIN` (default `http://localhost:5173`, a
typical Vite dev server).

## 9. Which features are real

- User registration/login with bcrypt password hashing — plaintext passwords are never stored
- JWT issuance and verification on every protected route
- Safety plan creation with a **server-computed and server-verified** `expires_at`
- Server-side state machine (`ACTIVE → CHECK_IN → NO_RESPONSE/RESPONDED_SAFE → ESCALATING → RIDE_REQUESTED → ...`), re-evaluated against real server time on every read — not trusted from the client
- GPS location ingestion and "most recent known location" lookup
- Escalation orchestration chain (safety → location → emergency → wallet → ride) with real MongoDB writes at each step
- Wallet balance/reserved-amount tracking with insufficient-funds rejection
- Full CRUD-style ride lifecycle (`REQUESTED → DRIVER_ACCEPTED → DRIVER_EN_ROUTE/STARTED → COMPLETED`)

## 10. Which features are simulated

- **Emergency notifications**: no real SMS/WhatsApp/call is sent. Every
  notification document is returned with `notification_created: true` and
  `demo: true` — nothing claims a message actually reached the contact's phone.
- **Wallet payments**: no real payment gateway is integrated. "Add funds" and
  "authorize" only mutate numbers in MongoDB; every transaction is stamped `simulated: true`.
- **Driver matching**: there is no real driver network. Every ride gets the
  same mock driver (**Arjun**, `KA 01 AB 1234`, ETA 8 min) once accepted.
- **Continued GPS after disconnect**: the backend never assumes it can keep
  tracking a phone that has gone offline or powered off. Escalation always
  falls back to the last *received* GPS point, or the pre-confirmed pickup
  location if none was ever received — not a live/continuing location.

## Notes on the timer architecture

- `POST /api/safety-plan` computes `expires_at = started_at + timer_minutes` in UTC, server-side, at creation time.
- The frontend may render any countdown UI it wants, but it is **purely
  cosmetic** — every plan read (`GET /api/safety-plan/current`, `GET /api/safety-plan/{id}`,
  and both `/respond` and `/escalate`) re-derives status from `expires_at` vs. the
  current server clock.
- After `expires_at` passes, the plan enters `CHECK_IN`. If no `/respond` call
  arrives within a short grace window (5s in demo mode, 60s otherwise), the
  *next* read of that plan auto-transitions it through `NO_RESPONSE → ESCALATING → RIDE_REQUESTED`
  — so even a frontend that never polls will resolve correctly the next time
  anyone asks for that plan's status.

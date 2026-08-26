"""
Safety plan service — the heart of SafeRide.

The backend is the source of truth for the timer. `expires_at` is computed
and stored server-side at creation time using server UTC clock; every read
of a plan re-checks the current server time against `expires_at` and
advances the state machine accordingly (ACTIVE -> CHECK_IN -> NO_RESPONSE).
The frontend's countdown is purely cosmetic.

State machine:
    PLANNED (unused placeholder for a future "not yet started" state)
    ACTIVE -> CHECK_IN (once expires_at passes)
    CHECK_IN -> RESPONDED_SAFE       (user responds SAFE)
    CHECK_IN -> ESCALATING           (user responds RIDE, or grace period elapses -> NO_RESPONSE -> ESCALATING)
    ESCALATING -> RIDE_REQUESTED -> DRIVER_ACCEPTED -> DRIVER_EN_ROUTE -> COMPLETED
    (any open state) -> CANCELLED
"""
from datetime import datetime, timedelta, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.config.database import safety_plans_col
from app.config.settings import settings
from app.models.safety_plan import new_safety_plan_doc, serialize_safety_plan
from app.services import location_service, emergency_service, wallet_service, ride_service
from app.utils.constants import SafetyStatus, CheckInResponse

# How long after expires_at we wait for a check-in response before treating
# it as NO_RESPONSE and auto-escalating. Kept short in demo mode so the
# hackathon demo doesn't require waiting around.
_GRACE_SECONDS = 5 if settings.DEMO_MODE else 60


def _now():
    return datetime.now(timezone.utc)


def _get_plan_or_404(plan_id: str, user_id: str = None) -> dict:
    try:
        oid = ObjectId(plan_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid safety plan id")
    query = {"_id": oid}
    if user_id:
        query["user_id"] = user_id
    doc = safety_plans_col.find_one(query)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Safety plan not found")
    return doc


def _save_status(doc: dict, new_status: str, extra: dict = None) -> dict:
    update = {"status": new_status, "updated_at": _now()}
    if extra:
        update.update(extra)
    safety_plans_col.update_one({"_id": doc["_id"]}, {"$set": update})
    doc = safety_plans_col.find_one({"_id": doc["_id"]})
    return doc


def _apply_expiry(doc: dict) -> dict:
    """
    Re-evaluates a plan's state against server time. This is called on every
    read/write path so the backend timer is always authoritative, even if no
    client ever calls back in.
    """
    now = _now()
    expires_at = doc["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if doc["status"] == SafetyStatus.ACTIVE and now >= expires_at:
        doc = _save_status(doc, SafetyStatus.CHECK_IN)
        return doc

    if doc["status"] == SafetyStatus.CHECK_IN:
        grace_deadline = expires_at + timedelta(seconds=_GRACE_SECONDS)
        if now >= grace_deadline:
            doc = _save_status(doc, SafetyStatus.NO_RESPONSE)
            doc = _run_escalation(doc)
            return doc

    return doc


def _seconds_remaining(doc: dict) -> float:
    expires_at = doc["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    remaining = (expires_at - _now()).total_seconds()
    return max(0.0, remaining)


def to_response(doc: dict) -> dict:
    data = serialize_safety_plan(doc)
    data["seconds_remaining"] = _seconds_remaining(doc)
    return data


# ---------- Public operations ----------

def create_safety_plan(
    user_id: str,
    pickup: dict,
    destination: dict,
    timer_minutes: float,
    emergency_contact_id: str,
    wallet_amount: float,
) -> dict:
    # Only one open safety plan per user at a time.
    existing = safety_plans_col.find_one(
        {"user_id": user_id, "status": {"$in": list(SafetyStatus.OPEN_STATES)}}
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An active safety plan already exists for this user. Cancel it before creating a new one.",
        )

    started_at = _now()
    expires_at = started_at + timedelta(minutes=timer_minutes)

    doc = new_safety_plan_doc(
        user_id=user_id,
        pickup=pickup,
        destination=destination,
        timer_minutes=timer_minutes,
        emergency_contact_id=emergency_contact_id,
        wallet_amount=wallet_amount,
        started_at=started_at,
        expires_at=expires_at,
    )
    result = safety_plans_col.insert_one(doc)
    doc["_id"] = result.inserted_id
    return to_response(doc)


def get_current_plan(user_id: str) -> dict:
    doc = safety_plans_col.find_one(
        {"user_id": user_id, "status": {"$in": list(SafetyStatus.OPEN_STATES)}},
        sort=[("created_at", -1)],
    )
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active safety plan")
    doc = _apply_expiry(doc)
    return to_response(doc)


def get_plan_by_id(plan_id: str, user_id: str) -> dict:
    doc = _get_plan_or_404(plan_id, user_id)
    doc = _apply_expiry(doc)
    return to_response(doc)


def respond_to_check_in(plan_id: str, user_id: str, response: str) -> dict:
    if response not in CheckInResponse.ALL:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="response must be SAFE or RIDE")

    doc = _get_plan_or_404(plan_id, user_id)
    doc = _apply_expiry(doc)

    if doc["status"] not in (SafetyStatus.ACTIVE, SafetyStatus.CHECK_IN):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot respond to a plan in status {doc['status']}",
        )

    if response == CheckInResponse.SAFE:
        doc = _save_status(doc, SafetyStatus.RESPONDED_SAFE)
        return to_response(doc)

    # response == RIDE: user is proactively asking for a safety ride
    doc = _save_status(doc, SafetyStatus.ESCALATING)
    doc = _run_escalation(doc)
    return to_response(doc)


def escalate_plan(plan_id: str, user_id: str) -> dict:
    """
    Explicit escalation endpoint. Used for the "no response" path when a
    client detects (or the backend independently confirms) that the check-in
    window has elapsed. The backend re-verifies expiry itself rather than
    trusting the caller.
    """
    doc = _get_plan_or_404(plan_id, user_id)
    doc = _apply_expiry(doc)  # may already have auto-escalated via grace period

    if doc["status"] in (SafetyStatus.ESCALATING, SafetyStatus.RIDE_REQUESTED,
                          SafetyStatus.DRIVER_ACCEPTED, SafetyStatus.DRIVER_EN_ROUTE):
        # Already escalated (e.g. by the grace-period auto-check above) — idempotent.
        return to_response(doc)

    if doc["status"] not in (SafetyStatus.CHECK_IN, SafetyStatus.NO_RESPONSE):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Cannot escalate a plan in status {doc['status']}. "
                "The safety timer must expire before escalation is allowed."
            ),
        )

    doc = _save_status(doc, SafetyStatus.NO_RESPONSE)
    doc = _run_escalation(doc)
    return to_response(doc)


def cancel_plan(plan_id: str, user_id: str) -> dict:
    doc = _get_plan_or_404(plan_id, user_id)
    if doc["status"] in SafetyStatus.TERMINAL_STATES:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot cancel a plan already in status {doc['status']}",
        )
    doc = _save_status(doc, SafetyStatus.CANCELLED)
    return to_response(doc)


# ---------- Internal escalation orchestration ----------

def _run_escalation(doc: dict) -> dict:
    """
    Runs the full escalation chain:
    safety_service -> location_service -> emergency_service -> wallet_service -> ride_service
    Each step is best-effort logged onto the plan; if wallet authorization
    fails (insufficient balance) we still proceed with the emergency
    notification and ride request — safety comes first, payment is secondary.
    """
    doc = _save_status(doc, SafetyStatus.ESCALATING)
    user_id = doc["user_id"]

    # 1. Last known location (GPS if we have it, else the confirmed pickup point)
    location = location_service.get_last_known_or_fallback(user_id, doc["pickup"])
    doc = _save_status(doc, doc["status"], {"last_known_location": location})

    # 2. Emergency notification (simulated)
    if doc.get("emergency_contact_id"):
        try:
            emergency_service.notify(
                user_id=user_id,
                safety_plan_id=str(doc["_id"]),
                contact_id=doc["emergency_contact_id"],
                location=location,
            )
        except HTTPException:
            pass  # notification failure should never block the safety flow

    # 3. Wallet authorization (simulated; non-blocking on failure)
    try:
        wallet_service.authorize_amount(
            user_id=user_id,
            amount=doc.get("wallet_amount", 0.0),
            note=f"SafeRide escalation for plan {doc['_id']}",
        )
    except HTTPException:
        pass  # insufficient balance should not block dispatching a safety ride

    # 4. Ride request
    ride_service.create_ride_request(
        user_id=user_id,
        safety_plan_id=str(doc["_id"]),
        pickup=doc["pickup"],
        destination=doc["destination"],
    )

    doc = _save_status(doc, SafetyStatus.RIDE_REQUESTED)
    return doc

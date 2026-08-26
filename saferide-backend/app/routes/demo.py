"""
Demo data seeding — only enabled when DEMO_MODE=true. Not part of the core
spec's folder list, but included so hackathon judges can get from zero to a
working demo in one call instead of manually registering/adding funds/etc.
"""
from fastapi import APIRouter, HTTPException, status

from app.config.database import users_col
from app.config.settings import settings
from app.models.user import new_user_doc, serialize_user
from app.services import emergency_service, wallet_service
from app.utils.security import hash_password, create_access_token

router = APIRouter(prefix="/api/demo", tags=["demo"])

DEMO_EMAIL = "demo@saferide.app"
DEMO_PASSWORD = "demo1234"


@router.post("/seed")
def seed_demo_data():
    if not settings.DEMO_MODE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="DEMO_MODE is disabled")

    doc = users_col.find_one({"email": DEMO_EMAIL})
    if not doc:
        doc = new_user_doc(
            name="Demo User", email=DEMO_EMAIL, hashed_password=hash_password(DEMO_PASSWORD)
        )
        result = users_col.insert_one(doc)
        doc["_id"] = result.inserted_id

    user = serialize_user(doc)
    user_id = user["id"]

    # Ensure an emergency contact exists
    try:
        contact = emergency_service.get_contact(user_id)
    except HTTPException:
        contact = emergency_service.create_contact(
            user_id=user_id, name="Priya Sharma", phone="+91-9876543210", relationship="Sister"
        )

    # Top up wallet so authorization succeeds during the demo escalation
    wallet = wallet_service.add_funds(user_id, 500.0)

    token = create_access_token(user_id=user_id, email=user["email"])

    return {
        "message": "Demo data ready",
        "credentials": {"email": DEMO_EMAIL, "password": DEMO_PASSWORD},
        "access_token": token,
        "user": user,
        "emergency_contact": contact,
        "wallet": wallet,
        "demo_timer_seconds": settings.DEMO_TIMER_SECONDS,
    }

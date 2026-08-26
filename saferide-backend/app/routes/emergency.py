from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.emergency import (
    EmergencyContactRequest,
    EmergencyContactResponse,
    NotifyRequest,
    NotifyResponse,
)
from app.services import emergency_service, safety_service
from app.utils.security import get_current_user_id

router = APIRouter(prefix="/api/emergency", tags=["emergency"])


@router.post("/contact", response_model=EmergencyContactResponse, status_code=status.HTTP_201_CREATED)
def create_contact(payload: EmergencyContactRequest, user_id: str = Depends(get_current_user_id)):
    result = emergency_service.create_contact(
        user_id=user_id, name=payload.name, phone=payload.phone, relationship=payload.relationship
    )
    return EmergencyContactResponse(**result)


@router.get("/contact", response_model=EmergencyContactResponse)
def get_contact(user_id: str = Depends(get_current_user_id)):
    result = emergency_service.get_contact(user_id)
    return EmergencyContactResponse(**result)


@router.post("/notify", response_model=NotifyResponse)
def notify(payload: NotifyRequest, user_id: str = Depends(get_current_user_id)):
    plan = safety_service.get_plan_by_id(payload.safety_plan_id, user_id)
    if not plan.get("emergency_contact_id"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This safety plan has no emergency contact on file",
        )
    location = plan.get("last_known_location") or {
        "lat": plan["pickup"]["lat"],
        "lng": plan["pickup"]["lng"],
        "source": "pickup_fallback",
    }
    result = emergency_service.notify(
        user_id=user_id,
        safety_plan_id=plan["id"],
        contact_id=plan["emergency_contact_id"],
        location=location,
    )
    return NotifyResponse(**result)

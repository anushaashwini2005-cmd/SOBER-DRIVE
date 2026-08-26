from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.safety import CreateSafetyPlanRequest, RespondRequest, SafetyPlanResponse
from app.services import safety_service, emergency_service
from app.utils.security import get_current_user_id

router = APIRouter(prefix="/api/safety-plan", tags=["safety"])


@router.post("", response_model=SafetyPlanResponse, status_code=status.HTTP_201_CREATED)
def create_safety_plan(payload: CreateSafetyPlanRequest, user_id: str = Depends(get_current_user_id)):
    emergency_contact_id = payload.emergency_contact_id
    if not emergency_contact_id:
        # Fall back to the user's most recently saved contact, if any.
        try:
            emergency_contact_id = emergency_service.get_contact(user_id)["id"]
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No emergency_contact_id provided and no saved emergency contact found",
            )
    else:
        # Validate ownership of the referenced contact.
        emergency_service.get_contact_by_id(user_id, emergency_contact_id)

    result = safety_service.create_safety_plan(
        user_id=user_id,
        pickup=payload.pickup.model_dump(),
        destination=payload.destination.model_dump(),
        timer_minutes=payload.timer_minutes,
        emergency_contact_id=emergency_contact_id,
        wallet_amount=payload.wallet_amount,
    )
    return SafetyPlanResponse(**result)


@router.get("/current", response_model=SafetyPlanResponse)
def get_current_safety_plan(user_id: str = Depends(get_current_user_id)):
    result = safety_service.get_current_plan(user_id)
    return SafetyPlanResponse(**result)


@router.post("/{plan_id}/respond", response_model=SafetyPlanResponse)
def respond(plan_id: str, payload: RespondRequest, user_id: str = Depends(get_current_user_id)):
    result = safety_service.respond_to_check_in(plan_id, user_id, payload.response)
    return SafetyPlanResponse(**result)


@router.post("/{plan_id}/escalate", response_model=SafetyPlanResponse)
def escalate(plan_id: str, user_id: str = Depends(get_current_user_id)):
    result = safety_service.escalate_plan(plan_id, user_id)
    return SafetyPlanResponse(**result)


@router.post("/{plan_id}/cancel", response_model=SafetyPlanResponse)
def cancel(plan_id: str, user_id: str = Depends(get_current_user_id)):
    result = safety_service.cancel_plan(plan_id, user_id)
    return SafetyPlanResponse(**result)

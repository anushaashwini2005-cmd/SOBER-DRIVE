from fastapi import APIRouter, Depends

from app.schemas.ride import RideRequestRequest, RideResponse
from app.services import ride_service, safety_service
from app.utils.security import get_current_user_id

router = APIRouter(prefix="/api/rides", tags=["rides"])


@router.post("/request", response_model=RideResponse)
def request_ride(payload: RideRequestRequest, user_id: str = Depends(get_current_user_id)):
    plan = safety_service.get_plan_by_id(payload.safety_plan_id, user_id)
    result = ride_service.create_ride_request(
        user_id=user_id,
        safety_plan_id=plan["id"],
        pickup=plan["pickup"],
        destination=plan["destination"],
    )
    return RideResponse(**result)


@router.get("/current", response_model=RideResponse)
def current_ride(user_id: str = Depends(get_current_user_id)):
    result = ride_service.get_current_ride(user_id)
    return RideResponse(**result)


@router.post("/{ride_id}/accept", response_model=RideResponse)
def accept_ride(ride_id: str, user_id: str = Depends(get_current_user_id)):
    result = ride_service.accept_ride(ride_id, user_id)
    return RideResponse(**result)


@router.post("/{ride_id}/start", response_model=RideResponse)
def start_ride(ride_id: str, user_id: str = Depends(get_current_user_id)):
    result = ride_service.start_ride(ride_id, user_id)
    return RideResponse(**result)


@router.post("/{ride_id}/complete", response_model=RideResponse)
def complete_ride(ride_id: str, user_id: str = Depends(get_current_user_id)):
    result = ride_service.complete_ride(ride_id, user_id)
    return RideResponse(**result)

from fastapi import APIRouter, Depends

from app.schemas.location import LocationUpdateRequest, LocationResponse
from app.services import location_service
from app.utils.security import get_current_user_id

router = APIRouter(prefix="/api/location", tags=["location"])


@router.post("/update", response_model=LocationResponse)
def update_location(payload: LocationUpdateRequest, user_id: str = Depends(get_current_user_id)):
    result = location_service.record_location(
        user_id=user_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        accuracy=payload.accuracy,
    )
    return LocationResponse(**result)


@router.get("/current", response_model=LocationResponse)
def get_current_location(user_id: str = Depends(get_current_user_id)):
    result = location_service.get_current_location(user_id)
    return LocationResponse(**result)

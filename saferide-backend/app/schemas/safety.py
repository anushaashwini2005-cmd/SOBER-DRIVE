from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.utils.constants import CheckInResponse


class GeoPoint(BaseModel):
    label: str = Field(..., description="Human readable place name")
    lat: float
    lng: float


class CreateSafetyPlanRequest(BaseModel):
    pickup: GeoPoint
    destination: GeoPoint
    timer_minutes: float = Field(
        ..., gt=0, le=1440, description="Safety timer duration in minutes"
    )
    emergency_contact_id: Optional[str] = Field(
        None, description="If omitted, the user's most recently saved contact is used"
    )
    wallet_amount: float = Field(..., ge=0, description="Amount to reserve if escalation occurs")


class RespondRequest(BaseModel):
    response: str = Field(..., description="SAFE or RIDE")

    def validate_choice(self) -> None:
        if self.response not in CheckInResponse.ALL:
            raise ValueError("response must be one of: SAFE, RIDE")


class LocationOut(BaseModel):
    label: Optional[str] = None
    lat: float
    lng: float
    source: Optional[str] = None  # "gps" | "pickup_fallback"


class SafetyPlanResponse(BaseModel):
    id: str
    user_id: str
    pickup: GeoPoint
    destination: GeoPoint
    timer_minutes: float
    started_at: datetime
    expires_at: datetime
    status: str
    emergency_contact_id: Optional[str] = None
    wallet_amount: float
    last_known_location: Optional[dict] = None
    created_at: datetime
    updated_at: datetime
    seconds_remaining: Optional[float] = None

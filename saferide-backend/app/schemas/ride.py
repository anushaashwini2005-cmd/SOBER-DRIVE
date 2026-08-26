from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.schemas.safety import GeoPoint


class RideRequestRequest(BaseModel):
    safety_plan_id: str


class DriverInfo(BaseModel):
    name: str
    vehicle: str
    eta_minutes: int


class RideResponse(BaseModel):
    id: str
    user_id: str
    safety_plan_id: str
    pickup: GeoPoint
    destination: GeoPoint
    status: str
    driver: Optional[DriverInfo] = None
    created_at: datetime
    updated_at: datetime

"""
Shared constants / enums. Using plain string constants (not a strict Enum)
keeps Mongo documents simple to read/write while still giving us a single
source of truth for valid values.
"""


class SafetyStatus:
    PLANNED = "PLANNED"
    ACTIVE = "ACTIVE"
    CHECK_IN = "CHECK_IN"
    RESPONDED_SAFE = "RESPONDED_SAFE"
    NO_RESPONSE = "NO_RESPONSE"
    ESCALATING = "ESCALATING"
    RIDE_REQUESTED = "RIDE_REQUESTED"
    DRIVER_ACCEPTED = "DRIVER_ACCEPTED"
    DRIVER_EN_ROUTE = "DRIVER_EN_ROUTE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

    ALL = {
        PLANNED, ACTIVE, CHECK_IN, RESPONDED_SAFE, NO_RESPONSE, ESCALATING,
        RIDE_REQUESTED, DRIVER_ACCEPTED, DRIVER_EN_ROUTE, COMPLETED, CANCELLED,
    }

    # States from which the plan can still be actively monitored / responded to
    OPEN_STATES = {PLANNED, ACTIVE, CHECK_IN}

    # Terminal states — no further transitions allowed
    TERMINAL_STATES = {RESPONDED_SAFE, COMPLETED, CANCELLED}


class RideStatus:
    REQUESTED = "REQUESTED"
    DRIVER_ACCEPTED = "DRIVER_ACCEPTED"
    DRIVER_EN_ROUTE = "DRIVER_EN_ROUTE"
    STARTED = "STARTED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class CheckInResponse:
    SAFE = "SAFE"
    RIDE = "RIDE"

    ALL = {SAFE, RIDE}


MOCK_DRIVER = {
    "name": "Arjun",
    "vehicle": "KA 01 AB 1234",
    "eta_minutes": 8,
}

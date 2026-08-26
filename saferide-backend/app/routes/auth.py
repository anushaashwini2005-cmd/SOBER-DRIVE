from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from app.config.database import users_col
from app.models.user import new_user_doc, serialize_user
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.utils.security import hash_password, verify_password, create_access_token, get_current_user_id
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest):
    doc = new_user_doc(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        phone=payload.phone,
    )
    try:
        result = users_col.insert_one(doc)
    except DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    doc["_id"] = result.inserted_id
    user = serialize_user(doc)
    token = create_access_token(user_id=user["id"], email=user["email"])
    return TokenResponse(access_token=token, user=UserResponse(**user))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    doc = users_col.find_one({"email": payload.email.lower().strip()})
    if not doc or not verify_password(payload.password, doc["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    user = serialize_user(doc)
    token = create_access_token(user_id=user["id"], email=user["email"])
    return TokenResponse(access_token=token, user=UserResponse(**user))


@router.get("/me", response_model=UserResponse)
def me(user_id: str = Depends(get_current_user_id)):
    doc = users_col.find_one({"_id": ObjectId(user_id)})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(**serialize_user(doc))

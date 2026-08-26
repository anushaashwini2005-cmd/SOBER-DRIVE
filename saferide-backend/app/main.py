from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.config.database import init_indexes, ping
from app.config.settings import settings
from app.routes import auth, safety, location, emergency, wallet, ride, demo


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_indexes()
    yield


app = FastAPI(
    title="SafeRide API",
    description="Proactive safety ride platform backend — server-authoritative safety timer.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error", "errors": exc.errors()},
    )


app.include_router(auth.router)
app.include_router(safety.router)
app.include_router(location.router)
app.include_router(emergency.router)
app.include_router(wallet.router)
app.include_router(ride.router)
app.include_router(demo.router)


@app.get("/", tags=["health"])
def root():
    return {
        "service": "SafeRide API",
        "status": "ok",
        "demo_mode": settings.DEMO_MODE,
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "mongo_connected": ping()}

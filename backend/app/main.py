# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\main.py
# main.py

# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, audios, analyze, alerts
from app.api.routers.users import router as users_router
from app.core.config import settings
from app.core.logger import configure_logging

configure_logging()
app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(audios.router, prefix="/audios", tags=["audios"])
app.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])

@app.get("/healthz", tags=["health"])
async def health_check():
    return {"status": "ok"}

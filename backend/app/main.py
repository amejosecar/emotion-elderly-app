# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\main.py
# main.py

# backend/app/main.py

# File: backend/app/main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from app.core.config import settings
from app.core.logger import configure_logging
from app.core.metrics import get_metrics_app, metrics_middleware
from app.core.security import get_current_user

from app.api.routers import auth, audios, analyze, alerts
from app.api.routers.users import router as users_router

# 🔧 Configurar logging (Loguru)
configure_logging()

# 🚀 Crear instancia de FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 📊 Montar métricas de Prometheus en /metrics
metrics_app = get_metrics_app()
app.mount("/metrics", metrics_app)
app.middleware("http")(metrics_middleware)

# 🌐 Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🏠 Raíz: redirige a /docs o regresa bienvenida
@app.get("/", tags=["root"])
async def read_root():
    """End-point raíz. Redirige a la documentación de la API."""
    return RedirectResponse(url="/docs")

# ❤️ Health check
@app.get("/healthz", tags=["health"])
async def health_check():
    return JSONResponse({"status": "ok"})

# 🔐 Routers protegidos por autenticación
protected_dependencies = [Depends(get_current_user)]

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"], dependencies=protected_dependencies)
app.include_router(audios.router, prefix="/audios", tags=["audios"], dependencies=protected_dependencies)
app.include_router(analyze.router, prefix="/analyze", tags=["analyze"], dependencies=protected_dependencies)
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"], dependencies=protected_dependencies)

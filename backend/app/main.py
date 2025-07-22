# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\main.py
# main.py

# backend/app/main.py
# app/main.py

from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.core.security import get_current_user, get_current_user_optional

from app.core.config import settings
from app.core.logger import configure_logging
from app.core.metrics import get_metrics_app, metrics_middleware
from app.core.security import get_current_user, get_current_user_optional

from app.api.routers import auth, users, audios, analyze, alerts

configure_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Metrics
metrics_app = get_metrics_app()
app.mount(
    "/static",
    StaticFiles(directory="app/templates/static"),
    name="static"
)
app.middleware("http")(metrics_middleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static + Templates
app.mount("/static", StaticFiles(directory="app/templates/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# Home: muestra panel con o sin usuario
@app.get("/", tags=["root"])
async def index(request: Request, user=Depends(get_current_user_optional)):
    return templates.TemplateResponse("index.html", {"request": request, "user": user})

# Logout
@app.get("/logout", tags=["auth"])
async def logout():
    resp = RedirectResponse("/", status_code=303)
    resp.delete_cookie("access_token")
    return resp

# Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
protected = [Depends(get_current_user)]
app.include_router(users.router,    prefix="/users",   tags=["users"],    dependencies=protected)
app.include_router(audios.router,   prefix="/audios",  tags=["audios"],   dependencies=protected)
app.include_router(analyze.router,  prefix="/analyze", tags=["analyze"],  dependencies=protected)
app.include_router(alerts.router,   prefix="/alerts",  tags=["alerts"],   dependencies=protected)

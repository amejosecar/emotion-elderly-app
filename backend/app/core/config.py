# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\core\config.py
# backend/app/core/config.py

from typing import List
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    # Seguridad
    SECRET_KEY: str = "changeme"

    # Base de datos (puede ser SQLite o Postgres)
    DATABASE_URL: str = "sqlite:///./app.db"

    # Modelo de Hugging Face
    HUGGINGFACE_MODEL: str = "dummy-model"

    # Ruta local de almacenamiento de audios
    STORAGE_PATH: str = "./data/audios"

    # Orígenes permitidos para CORS
    CORS_ORIGINS: List[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    # Metadatos del proyecto
    PROJECT_NAME: str = "Emotion Elderly API"
    VERSION: str = "0.1.0"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
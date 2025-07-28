# backend/app/core/config.py

from typing import List, Union
from pydantic import BaseSettings, Field, validator


class Settings(BaseSettings):
    """
    Configuración central de la aplicación, cargada desde .env.
    """

    # Seguridad y JWT
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # URL de la base de datos: un único parámetro para SQLite, Postgres, MySQL, etc.
    DATABASE_URL: str = "sqlite:///./app.db"

    # Modelo de Hugging Face para análisis de voz
    HUGGINGFACE_MODEL: str = "CAiRE/SER-wav2vec2-large-xlsr-53-eng-zho-elderly"

    # Ruta local de almacenamiento de audios
    STORAGE_PATH: str = "./sonido/audios"

    # Umbral mínimo para alertas
    ALERT_THRESHOLD: float = Field(0.1, env="ALERT_THRESHOLD")

    # Orígenes permitidos para CORS (puede venir como CSV en .env)
    CORS_ORIGINS: Union[str, List[str]] = Field(
        default_factory=lambda: ["http://localhost:3000"]
    )

    # Configuración de logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "[{time:YYYY-MM-DD HH:mm:ss}] {level} | {message}"

    # Metadatos de la API
    PROJECT_NAME: str = "Emotion Elderly API"
    VERSION: str = "0.1.0"

    @validator("CORS_ORIGINS", pre=True)
    def split_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """
        Permite definir CORS_ORIGINS en .env como un CSV
        y lo convierte a lista de cadenas.
        """
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Instancia global de configuración
settings = Settings()

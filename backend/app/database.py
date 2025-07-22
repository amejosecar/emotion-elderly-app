# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from app.core.config import settings

# Declarative base para tus modelos
Base = declarative_base()

# URL única para la BD (sqlite, postgres, mysql, etc.)
DATABASE_URL = settings.DATABASE_URL

# Parámetros de conexión específicos para SQLite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

# Crear el engine
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

# Sesión local para dependencias
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    """
    Dependencia de FastAPI para obtener una sesión de DB.
    Y la cierra al terminar la request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

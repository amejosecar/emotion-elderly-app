# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\db\session.py
# session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# El engine lee la URL desde settings (cad str)
engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})

# Cada petición obtiene su propia sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\dependencies.py
# dependencies.py
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

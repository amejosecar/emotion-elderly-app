# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\routers\auth.py
# auth.py
# backend/app/api/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.models.user import User
from app.schemas.auth import Token
from app.schemas.user import UserCreate
from app.core.security import (
    get_password_hash, verify_password,
    create_access_token, get_current_user  # ✅ Importación corregida
)

router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(400, "Email registrado")
    hashed = get_password_hash(user.password)
    new = User(email=user.email, hashed_password=hashed)
    db.add(new); db.commit(); db.refresh(new)
    return {"message": "Usuario creado"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(401, "Credenciales inválidas")
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/refresh", response_model=Token)
def refresh_token(user: User = Depends(get_current_user)):
    new_token = create_access_token({"sub": str(user.id)})
    return {"access_token": new_token, "token_type": "bearer"}

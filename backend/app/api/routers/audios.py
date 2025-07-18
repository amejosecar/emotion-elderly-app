# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\routers\audios.py
# audios.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4
import os

from app.api.dependencies import get_db
from app.core.config import settings
from app.core.security import get_current_user
from app.models.audio import Audio
from app.models.user import User
from app.schemas.audio import AudioRead

router = APIRouter()

@router.post("/", response_model=AudioRead, summary="Subir audio")
async def upload_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Guardar el archivo en disco
    ext = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid4().hex}{ext}"
    save_dir = settings.STORAGE_PATH
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, unique_name)

    try:
        content = await file.read()
        with open(save_path, "wb") as f:
            f.write(content)
    except Exception:
        raise HTTPException(status_code=500, detail="Error guardando el archivo")

    # 2. Crear registro en la base de datos
    audio = Audio(user_id=current_user.id, file_path=save_path)
    db.add(audio)
    db.commit()
    db.refresh(audio)

    return audio

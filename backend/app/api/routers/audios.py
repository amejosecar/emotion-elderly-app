from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4
import os
from typing import List

from app.api.dependencies import get_db
from app.core.config import settings
from app.core.security import get_current_user
from app.models import User, Audio, Alert, Emotion, Role
from app.schemas.audio import AudioRead

router = APIRouter()

# 📥 Subir audio
@router.post("/", response_model=AudioRead, summary="Subir audio")
async def upload_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # ✅ Validar tipo MIME
    ALLOWED_MIME_TYPES = {"audio/wav", "audio/x-wav", "audio/mpeg", "audio/mp3", "audio/x-m4a"}
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail=f"Tipo de archivo no permitido: {file.content_type}")

    # 📁 Preparar ruta de guardado
    ext = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid4().hex}{ext}"
    save_dir = settings.STORAGE_PATH
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, unique_name)

    # 🧪 Guardar archivo en disco
    try:
        content = await file.read()
        with open(save_path, "wb") as f:
            f.write(content)
    except Exception:
        raise HTTPException(status_code=500, detail="Error guardando el archivo")

    # ✅ Verificar que el archivo existe y tiene contenido
    if not os.path.exists(save_path) or os.path.getsize(save_path) == 0:
        raise HTTPException(status_code=500, detail="Archivo no guardado correctamente")

    # 🧾 Registrar en la base de datos
    audio = Audio(user_id=current_user.id, file_path=save_path)
    db.add(audio)
    db.commit()
    db.refresh(audio)

    return audio


# 📄 Listar audios del usuario
@router.get("/", response_model=List[AudioRead], summary="Listar audios")
def list_audios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    audios = db.query(Audio).filter(Audio.user_id == current_user.id).all()
    return audios

# backend/app/api/routers/audios.py
from fastapi import (
    APIRouter, UploadFile, File,
    Depends, HTTPException, BackgroundTasks
)
from typing import List
from sqlalchemy.orm import Session
from uuid import uuid4
import os

from app.api.dependencies import get_db
from app.core.config import settings
from app.core.security import get_current_user
from app.models import Audio
from app.schemas.audio import AudioRead
from app.services.audio_processing import process_audio

router = APIRouter(tags=["audios"])

# ─── Subir un único audio ────────────────────────────────────
@router.post(
    "/",
    response_model=AudioRead,
    summary="Subir un único audio"
)
async def upload_audio(
    background_tasks: BackgroundTasks,  # ✅ primero
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Validación MIME
    ALLOWED = {
        "audio/wav", "audio/x-wav",
        "audio/mpeg", "audio/mp3",
        "audio/x-m4a"
    }
    if file.content_type not in ALLOWED:
        raise HTTPException(400, f"Tipo no permitido: {file.content_type}")

    # Guardar en disco
    ext = os.path.splitext(file.filename)[1]
    name = f"{uuid4().hex}{ext}"
    save_dir = settings.STORAGE_PATH
    os.makedirs(save_dir, exist_ok=True)
    path = os.path.join(save_dir, name)

    content = await file.read()
    with open(path, "wb") as f:
        f.write(content)

    if not os.path.exists(path) or os.path.getsize(path) == 0:
        raise HTTPException(500, "Archivo no guardado correctamente")

    # Registrar en BD
    audio = Audio(user_id=current_user.id, file_path=path)
    db.add(audio)
    db.commit()
    db.refresh(audio)

    # ✅ Lanzar el análisis automáticamente en segundo plano
    background_tasks.add_task(
        process_audio,
        audio.id,
        path,
        current_user.id
    )

    return audio

# ─── Subir y procesar múltiples audios ───────────────────────
@router.post(
    "/bulk",
    response_model=List[AudioRead],
    summary="Subir y procesar múltiples audios"
)
async def upload_bulk_audios(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(..., description="Archivos de audio"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    saved: List[Audio] = []

    for file in files:
        if not file.content_type.startswith("audio/"):
            raise HTTPException(400, f"Tipo no permitido: {file.content_type}")

        ext = os.path.splitext(file.filename)[1]
        name = f"{uuid4().hex}{ext}"
        save_dir = settings.STORAGE_PATH
        os.makedirs(save_dir, exist_ok=True)
        path = os.path.join(save_dir, name)

        content = await file.read()
        with open(path, "wb") as f:
            f.write(content)

        audio = Audio(user_id=current_user.id, file_path=path)
        db.add(audio)
        db.commit()
        db.refresh(audio)
        saved.append(audio)

        # ✅ Lanzar el análisis en background
        background_tasks.add_task(
            process_audio,
            audio.id,
            path,
            current_user.id
        )

    return saved

# ─── Listar audios del usuario ───────────────────────────────
@router.get(
    "/",
    response_model=List[AudioRead],
    summary="Listar audios del usuario"
)
def list_audios(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(Audio).filter(Audio.user_id == current_user.id).all()

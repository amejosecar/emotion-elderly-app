# backend/app/api/routers/analyze.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import logging
from pathlib import Path
from typing import List

from app.api.dependencies import get_db
from app.core.security import get_current_user
from app.models import User, Audio, Alert, Emotion
from app.schemas.emotion import AnalysisResult, EmotionRead
from app.schemas.alert import AlertRead
from app.services.emotion_recognition import recognize_emotions
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)
#ALERT_THRESHOLD = 0.8
# ALERT_THRESHOLD ahora viene de .env
ALERT_THRESHOLD = settings.ALERT_THRESHOLD


# 🔍 Obtener resultados de análisis de un audio
@router.get("/", response_model=AnalysisResult, summary="Obtener resultados de análisis")
def get_analysis(
    audio_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    audio = db.query(Audio).filter(Audio.id == audio_id, Audio.user_id == current_user.id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Audio no encontrado")

    emotions = db.query(Emotion).filter(Emotion.audio_id == audio.id).all()
    emotion_ids = [e.id for e in emotions]
    alerts = db.query(Alert).filter(Alert.emotion_id.in_(emotion_ids)).all()

    return AnalysisResult(
        audio_id=audio.id,
        emotions=emotions,
        alerts=alerts
    )

# 🔁 Ejecutar análisis sobre un audio
@router.post("/", response_model=AnalysisResult, summary="Analizar emociones")
def analyze_audio(
    audio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    audio = db.query(Audio).filter(Audio.id == audio_id, Audio.user_id == current_user.id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Audio no encontrado")

    path = Path(audio.file_path).expanduser().resolve()
    logger.info(f"📥 Analizando audio en: {path}")
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Audio no existe: {path}")

    try:
        results = recognize_emotions(str(path))
        logger.info(f"🔍 Resultados del modelo: {results}")
    except FileNotFoundError as e:
        logger.error(str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception:
        logger.exception("Error interno al analizar emociones")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Fallo al analizar emociones")

    saved_emotions, generated_alerts = [], []
    for r in results:
        emo = Emotion(audio_id=audio.id, label=r["label"], confidence=r["score"])
        db.add(emo)
        db.commit()
        db.refresh(emo)
        saved_emotions.append(emo)
        logger.info(f"✅ Emoción guardada: {emo.label} ({emo.confidence:.2f})")

        if r["score"] >= ALERT_THRESHOLD:
            msg = f"Detected {r['label']} with confidence {r['score']:.2f}"
            al = Alert(user_id=current_user.id, emotion_id=emo.id, message=msg)
            db.add(al)
            db.commit()
            db.refresh(al)
            generated_alerts.append(al)
            logger.info(f"🚨 Alerta generada: {msg}")

    return AnalysisResult(
        audio_id=audio.id,
        emotions=saved_emotions,
        alerts=generated_alerts
    )

# 🆕 Listar todas las emociones del usuario
@router.get("/emotions", response_model=List[EmotionRead], summary="Listar emociones por usuario")
def list_user_emotions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    emotions = (
        db.query(Emotion)
        .join(Audio)
        .filter(Audio.user_id == current_user.id)
        .all()
    )
    return emotions

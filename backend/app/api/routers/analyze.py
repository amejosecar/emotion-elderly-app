# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\routers\analyze.py
# analyze.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
from pathlib import Path

from app.api.dependencies import get_db
from app.core.security import get_current_user
from app.models.audio import Audio
from app.models.emotion import Emotion
from app.models.alert import Alert
from app.schemas.emotion import AnalysisResult
from app.schemas.alert import AlertRead
from app.services.emotion_recognition import recognize_emotions

router = APIRouter()
logger = logging.getLogger(__name__)
ALERT_THRESHOLD = 0.8

@router.post("/", response_model=AnalysisResult, summary="Analizar emociones")
def analyze_audio(
    audio_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # 1) Verificar existencia y propiedad
    audio = (
        db.query(Audio)
          .filter(Audio.id == audio_id, Audio.user_id == current_user.id)
          .first()
    )
    if not audio:
        raise HTTPException(status_code=404, detail="Audio no encontrado")

    # 2) Normalizar ruta y validar en disco
    path = Path(audio.file_path).expanduser().resolve()
    logger.info(f"Analizando audio en: {path}")
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Audio no existe: {path}")

    # 3) Llamar al servicio de reconocimiento
    try:
        results = recognize_emotions(str(path))
    except FileNotFoundError as e:
        logger.error(str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    except Exception:
        logger.exception("Error interno al analizar emociones")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Fallo al analizar emociones"
        )

    # 4) Persistir emociones y generar alertas
    saved_emotions, generated_alerts = [], []
    for r in results:
        emo = Emotion(audio_id=audio.id, label=r["label"], confidence=r["score"])
        db.add(emo); db.commit(); db.refresh(emo)
        saved_emotions.append(emo)

        if r["score"] >= ALERT_THRESHOLD:
            msg = f"Detected {r['label']} with confidence {r['score']:.2f}"
            al = Alert(user_id=current_user.id, emotion_id=emo.id, message=msg)
            db.add(al); db.commit(); db.refresh(al)
            generated_alerts.append(al)

    return AnalysisResult(
        audio_id=audio.id,
        emotions=saved_emotions,
        alerts=generated_alerts
    )

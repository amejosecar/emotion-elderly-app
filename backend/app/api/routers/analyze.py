# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\routers\analyze.py
# analyze.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.security import get_current_user
from app.models.audio import Audio
from app.models.emotion import Emotion
from app.models.alert import Alert
from app.schemas.emotion import AnalysisResult
from app.schemas.alert import AlertRead
from app.services.emotion_recognition import recognize_emotions

router = APIRouter()

# Umbral a partir del cual generamos alerta
ALERT_THRESHOLD = 0.8

@router.post("/", response_model=AnalysisResult, summary="Analizar emociones")
def analyze_audio(
    audio_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verificamos que el audio exista y pertenezca al usuario
    audio = (
        db.query(Audio)
        .filter(Audio.id == audio_id, Audio.user_id == current_user.id)
        .first()
    )
    if not audio:
        raise HTTPException(status_code=404, detail="Audio no encontrado")

    # Invocamos el servicio de reconocimiento
    results = recognize_emotions(audio.file_path)

    saved_emotions = []
    generated_alerts = []

    for res in results:
        # Guardamos cada emoción detectada
        emo = Emotion(
            audio_id=audio.id,
            label=res["label"],
            confidence=res["score"]
        )
        db.add(emo)
        db.commit()
        db.refresh(emo)
        saved_emotions.append(emo)

        # Si supera el umbral, creamos alerta
        if res["score"] >= ALERT_THRESHOLD:
            message = f"Detected {res['label']} with confidence {res['score']:.2f}"
            alert = Alert(
                user_id=current_user.id,
                emotion_id=emo.id,
                message=message
            )
            db.add(alert)
            db.commit()
            db.refresh(alert)
            generated_alerts.append(alert)

    return AnalysisResult(
        audio_id=audio.id,
        emotions=saved_emotions,
        alerts=generated_alerts
    )


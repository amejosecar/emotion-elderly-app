# backend/app/api/routers/analyze.py
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from uuid import uuid4
import time

from app.api.dependencies import get_db
from app.core.security import get_current_user
from app.models import Audio, Emotion, Alert
from app.schemas.emotion import AnalysisResult, EmotionRead
from app.schemas.alert import AlertRead
from app.core.config import settings
from app.services.emotion_recognition import recognize_emotions
from app.db.session import SessionLocal

router = APIRouter()
JOBS: dict[str, dict] = {}

# 🧠 Función que ejecuta el análisis en segundo plano
def run_job(job_id: str, audio_id: int, user_id: int):
    db = SessionLocal()
    try:
        JOBS[job_id] = {"status": "running", "progress": 0, "audio_id": audio_id}
        time.sleep(0.1)
        JOBS[job_id]["progress"] = 10

        audio = db.query(Audio).filter(Audio.id == audio_id, Audio.user_id == user_id).first()
        if not audio:
            raise FileNotFoundError("Audio desaparecido en run_job")

        results = recognize_emotions(audio.file_path)
        JOBS[job_id]["progress"] = 60

        saved_emotions, generated_alerts = [], []
        for r in results:
            emo = Emotion(audio_id=audio_id, label=r["label"], confidence=r["score"])
            db.add(emo); db.commit(); db.refresh(emo)
            saved_emotions.append(emo)

            if r["score"] >= settings.ALERT_THRESHOLD:
                msg = f"Detected {r['label']} ({r['score']:.2f})"
                al = Alert(user_id=user_id, emotion_id=emo.id, message=msg)
                db.add(al); db.commit(); db.refresh(al)
                generated_alerts.append(al)

        emotions_payload = [EmotionRead.from_orm(e).dict() for e in saved_emotions]
        alerts_payload = [AlertRead.from_orm(a).dict() for a in generated_alerts]

        JOBS[job_id].update(
            status="done",
            progress=100,
            result={
                "audio_id": audio_id,
                "emotions": emotions_payload,
                "alerts": alerts_payload
            }
        )
    except Exception as e:
        JOBS[job_id].update(status="error", progress=100, result={"detail": str(e)})
    finally:
        db.close()

# 🚀 Iniciar análisis
@router.post("/start", summary="Iniciar análisis asíncrono")
def start_analysis(
    background_tasks: BackgroundTasks,
    audio_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    audio = db.query(Audio).filter(Audio.id == audio_id, Audio.user_id == current_user.id).first()
    if not audio:
        raise HTTPException(404, "Audio no encontrado")

    job_id = uuid4().hex
    JOBS[job_id] = {"status": "pending", "progress": 0, "audio_id": audio_id}
    background_tasks.add_task(run_job, job_id, audio_id, current_user.id)
    return {"job_id": job_id}

# 📊 Estado del job
@router.get("/status", summary="Estado de un job")
def get_status(job_id: str = Query(...)):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(404, "Job no encontrado")
    return {
        "status": job["status"],
        "progress": job["progress"],
        "audio_id": job["audio_id"],
    }

# 📈 Resultados por job_id
@router.get("/results", response_model=AnalysisResult, summary="Resultados de un job")
def get_results(job_id: str = Query(...)):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(404, "Job no encontrado")
    if job["status"] != "done":
        raise HTTPException(status.HTTP_202_ACCEPTED, "Job aún en ejecución")
    return job["result"]

# 📋 Todos los resultados del usuario
@router.get("/results/all", response_model=list[AnalysisResult], summary="Todos los resultados de análisis")
def get_all_results(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    audios = db.query(Audio).filter(Audio.user_id == current_user.id).all()
    results = []

    for audio in audios:
        emotions = db.query(Emotion).filter(Emotion.audio_id == audio.id).all()
        alerts = db.query(Alert).filter(Alert.emotion.has(audio_id=audio.id)).all()

        result = AnalysisResult(
            audio_id=audio.id,
            emotions=[EmotionRead.from_orm(e) for e in emotions],
            alerts=[AlertRead.from_orm(a) for a in alerts]
        )
        results.append(result)

    return results

# ✅ NUEVO: Obtener resultados por audio_id
@router.get("/by-audio", response_model=AnalysisResult, summary="Resultados por audio_id")
def get_result_by_audio(
    audio_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    audio = db.query(Audio).filter(Audio.id == audio_id, Audio.user_id == current_user.id).first()
    if not audio:
        raise HTTPException(404, "Audio no encontrado")

    emotions = db.query(Emotion).filter(Emotion.audio_id == audio.id).all()
    alerts = db.query(Alert).filter(Alert.emotion.has(audio_id=audio.id)).all()

    return AnalysisResult(
        audio_id=audio.id,
        emotions=[EmotionRead.from_orm(e) for e in emotions],
        alerts=[AlertRead.from_orm(a) for a in alerts]
    )

# 📊 Estado del job por audio_id
@router.get("/status/by-audio", summary="Estado del job por audio_id")
def get_status_by_audio(
    audio_id: int = Query(...),
    current_user = Depends(get_current_user)
):
    for job in JOBS.values():
        if job["audio_id"] == audio_id:
            return {
                "status": job["status"],
                "progress": job["progress"],
                "audio_id": job["audio_id"],
            }
    raise HTTPException(404, "No se encontró job para este audio")

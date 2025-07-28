#!/usr/bin/env python3
import sys
import os

# 1. Localiza la carpeta 'backend' relativa a este script
script_dir = os.path.dirname(__file__)
backend_dir = os.path.abspath(os.path.join(script_dir, "../backend"))

# 2. Inserta 'backend' al inicio del PYTHONPATH
sys.path.insert(0, backend_dir)

# Ahora ya puedes importar desde 'app'
from app.db.session import SessionLocal
from app.models import Audio, Emotion, Alert
from app.core.config import settings
from app.services.emotion_recognition import recognize_emotions

def main():
    db        = SessionLocal()
    threshold = settings.ALERT_THRESHOLD

    for audio in db.query(Audio).all():
        # 1) Cargar emociones existentes de este audio
        emotions = db.query(Emotion).filter(
            Emotion.audio_id == audio.id
        ).all()
        emotion_ids = [e.id for e in emotions]

        # 2) Borrar alertas ligadas a esas emociones
        if emotion_ids:
            db.query(Alert).filter(
                Alert.emotion_id.in_(emotion_ids)
            ).delete(synchronize_session=False)

        # 3) Borrar las emociones antiguas
        db.query(Emotion).filter(
            Emotion.audio_id == audio.id
        ).delete(synchronize_session=False)

        db.commit()

        # 4) Volver a reconocer y guardar de nuevo
        results = recognize_emotions(audio.file_path)
        for r in results:
            emo = Emotion(
                audio_id   = audio.id,
                label      = r["label"],
                confidence = r["score"],
            )
            db.add(emo)
            db.commit()
            db.refresh(emo)

            if r["score"] >= threshold:
                al = Alert(
                    user_id    = audio.user_id,
                    emotion_id = emo.id,
                    message    = f"Detected {r['label']} ({r['score']:.2f})"
                )
                db.add(al)
                db.commit()

    db.close()


if __name__ == "__main__":
    main()

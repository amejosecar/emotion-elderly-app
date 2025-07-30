# backend/app/services/audio_processing.py
import logging
from typing import List, Dict

from app.services.emotion_recognition import recognize_emotions
from app.db.session import SessionLocal
from app.models import Emotion, Alert
from app.core.config import settings

logger = logging.getLogger(__name__)

def process_audio(
    audio_id: int,
    file_path: str,
    user_id: int
):
    """
    Tarea en background:
      1) Ejecuta recognize_emotions().
      2) Persiste emociones.
      3) Genera alertas si confidence >= ALERT_THRESHOLD.
    """
    db = SessionLocal()
    try:
        logger.info(f"▶️ Procesando audio #{audio_id} en background")

        results: List[Dict] = recognize_emotions(file_path)

        if not results:
            logger.warning(f"⚠️ No se detectaron emociones en audio #{audio_id}")
            return

        with db.begin():  # ✅ agrupa transacciones
            for r in results:
                try:
                    emo = Emotion(
                        audio_id=audio_id,
                        label=r["label"],
                        confidence=r["score"]
                    )
                    db.add(emo)
                    db.flush()  # ✅ obtiene emo.id sin commit

                    if r["score"] >= settings.ALERT_THRESHOLD:
                        msg = f"Detected {r['label']} ({r['score']:.2f})"
                        al = Alert(
                            user_id=user_id,
                            emotion_id=emo.id,
                            message=msg
                        )
                        db.add(al)
                        logger.info(f"🚨 Alerta para audio {audio_id}: {msg}")

                except Exception as e:
                    logger.error(f"❌ Error procesando emoción {r}: {e}")

        logger.info(f"✅ Procesamiento completo para audio #{audio_id}")

    except Exception as e:
        logger.exception(f"❌ Error general procesando audio #{audio_id}: {e}")
    finally:
        db.close()

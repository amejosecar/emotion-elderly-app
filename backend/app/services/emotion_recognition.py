# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\services\emotion_recognition.py
# emotion_recognition.py
from typing import List, Dict
from transformers import pipeline
from app.core.config import settings
from pathlib import Path
import soundfile as sf
import numpy as np

# Cargamos el pipeline una sola vez
try:
    emotion_pipeline = pipeline(
        "audio-classification",
        model=settings.HUGGINGFACE_MODEL,
        top_k=5
    )
except Exception:
    emotion_pipeline = None

def recognize_emotions(file_path: str) -> List[Dict]:
    """
    Ejecuta el modelo de SER sobre el archivo de audio,
    asegurando que la señal sea mono.
    """
    if emotion_pipeline is None:
        raise RuntimeError("Pipeline no inicializado")

    p = Path(file_path).expanduser().resolve()
    if not p.exists():
        raise FileNotFoundError(f"Audio no encontrado: {p}")

    data, sr = sf.read(str(p))  # data puede ser mono o multi-canal

    # Si tiene más de un canal, convertir a mono por promedio
    if data.ndim > 1:
        data = np.mean(data, axis=1)

    return emotion_pipeline(data, sampling_rate=sr)

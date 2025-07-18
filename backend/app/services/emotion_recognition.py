# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\services\emotion_recognition.py
# emotion_recognition.py
from typing import List, Dict
from transformers import pipeline
from app.core.config import settings

# Cargamos el pipeline una sola vez al arrancar la app
emotion_pipeline = pipeline(
    "audio-classification",
    model=settings.HUGGINGFACE_MODEL,
    top_k=5
)

def recognize_emotions(file_path: str) -> List[Dict]:
    """
    Ejecuta el modelo de SER sobre el archivo de audio
    y devuelve una lista de dicts con 'label' y 'score'.
    """
    return emotion_pipeline(file_path)

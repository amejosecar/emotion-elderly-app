# emotion_recognition.py
# backend/app/services/emotion_recognition.py

from typing import List, Dict
from transformers import pipeline
from app.core.config import settings
from pathlib import Path
import soundfile as sf
import numpy as np
import logging

logger = logging.getLogger(__name__)

# Diccionario de mapeo de etiquetas
label_map = {
    "LABEL_0": "Alegría",
    "LABEL_1": "Tristeza",
    "LABEL_2": "Miedo",
    "LABEL_3": "Enojo",
    "LABEL_4": "Desagrado",
    "LABEL_5": "Sorpresa",
    "LABEL_6": "Confusión",
    "LABEL_7": "Calma",
    "LABEL_8": "Ansiedad",
    "LABEL_9": "Tristeza",
    "LABEL_10": "Alegría",
    "LABEL_11": "Miedo",
    "LABEL_12": "Enojo",
}

# Cargamos el pipeline una sola vez
try:
    emotion_pipeline = pipeline(
        "audio-classification",
        model=settings.HUGGINGFACE_MODEL,
        top_k=5
    )
except Exception as e:
    logger.error(f"❌ Error cargando modelo HuggingFace: {e}")
    emotion_pipeline = None


def recognize_emotions(file_path: str) -> List[Dict]:
    """
    Ejecuta el modelo de SER sobre el archivo de audio,
    asegurando que la señal sea mono.
    Devuelve una lista de emociones sin duplicados, 
    cada una con su score máximo, ordenadas descendentemente.
    """
    if emotion_pipeline is None:
        raise RuntimeError("Pipeline no inicializado")

    p = Path(file_path).expanduser().resolve()
    if not p.exists():
        raise FileNotFoundError(f"Audio no encontrado: {p}")

    # Leer señal de audio
    data, sr = sf.read(str(p))
    if data.size == 0:
        raise ValueError(f"⚠️ Audio vacío: {p}")

    # Convertir a mono si es necesario
    if data.ndim > 1:
        data = np.mean(data, axis=1)

    # Normalizar señal
    data = data / np.max(np.abs(data)) if np.max(np.abs(data)) > 0 else data

    # Clasificación cruda
    try:
        raw_results = emotion_pipeline(data, sampling_rate=sr)
        logger.info(f"🔍 Resultados del modelo para {p.name}: {raw_results}")
    except Exception as e:
        logger.error(f"❌ Error en clasificación de audio {p.name}: {e}")
        return []

    # Mapear labels legibles
    mapped = [
        {
            "label": label_map.get(r["label"], r["label"]),
            "score": r["score"]
        }
        for r in raw_results
    ]

    # Agrupar por etiqueta y conservar el score máximo
    unique_scores: Dict[str, float] = {}
    for item in mapped:
        lbl, scr = item["label"], item["score"]
        if lbl not in unique_scores or scr > unique_scores[lbl]:
            unique_scores[lbl] = scr

    # Reconstruir lista deduplicada, ordenada por score descendente
    deduped = [
        {"label": lbl, "score": unique_scores[lbl]}
        for lbl in sorted(unique_scores, key=lambda l: unique_scores[l], reverse=True)
    ]

    return deduped

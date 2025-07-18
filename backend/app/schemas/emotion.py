# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\schemas\emotion.py
# emotion.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List

class EmotionRead(BaseModel):
    id: int
    audio_id: int
    label: str
    confidence: float
    timestamp: datetime

    class Config:
        orm_mode = True

class AnalysisResult(BaseModel):
    audio_id: int
    emotions: List[EmotionRead]
    # Forward‐ref: no import directo de AlertRead aquí
    alerts: List["AlertRead"] = Field(default_factory=list)

    class Config:
        orm_mode = True

# Import tardío de AlertRead para resolver la forward‐ref
from app.schemas.alert import AlertRead

# Ahora sí la resolvemos
AnalysisResult.update_forward_refs()

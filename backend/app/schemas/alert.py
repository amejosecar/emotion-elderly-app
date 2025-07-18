# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\schemas\alert.py
# alert.py
from pydantic import BaseModel
from datetime import datetime
from typing import List

from app.schemas.emotion import EmotionRead

class AlertRead(BaseModel):
    id: int
    user_id: int
    emotion: EmotionRead
    message: str
    created_at: datetime

    class Config:
        orm_mode = True

class AlertList(BaseModel):
    alerts: List[AlertRead]

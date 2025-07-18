# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\schemas\audio.py
# audio.py
from pydantic import BaseModel
from datetime import datetime

class AudioRead(BaseModel):
    id: int
    file_path: str
    created_at: datetime

    class Config:
        orm_mode = True

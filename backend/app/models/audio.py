# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\models\audio.py
# audio.py
from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base

class Audio(Base):
    __tablename__ = "audios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_path = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    user = relationship("User", back_populates="audios")
    emotions = relationship("Emotion", back_populates="audio", cascade="all, delete-orphan")

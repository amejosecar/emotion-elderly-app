# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\models\emotion.py
# emotion.py
from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, String, Float, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base

class Emotion(Base):
    __tablename__ = "emotions"

    id = Column(Integer, primary_key=True, index=True)
    audio_id = Column(Integer, ForeignKey("audios.id"), nullable=False)
    label = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    audio = relationship("Audio", back_populates="emotions")
    alerts = relationship("Alert", back_populates="emotion", cascade="all, delete-orphan")

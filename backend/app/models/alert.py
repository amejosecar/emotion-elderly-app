# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\models\alert.py
# alert.py
from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    emotion_id = Column(Integer, ForeignKey("emotions.id"), nullable=False)
    message = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    user = relationship("User", back_populates="alerts")
    emotion = relationship("Emotion", back_populates="alerts")

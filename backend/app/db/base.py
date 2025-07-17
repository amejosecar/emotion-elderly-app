# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\db\base.py
# base.py
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# importa todos los modelos para que Base.metadata los conozca
from app.models.user import User
from app.models.role import Role
from app.models.audio import Audio
from app.models.emotion import Emotion
from app.models.alert import Alert

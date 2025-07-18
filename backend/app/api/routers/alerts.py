# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\routers\alerts.py
# alerts.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.security import get_current_user
from app.models.alert import Alert
from app.schemas.alert import AlertList

router = APIRouter()

@router.get("/", response_model=AlertList, summary="Listar alertas")
def list_alerts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    alerts = db.query(Alert).filter(Alert.user_id == current_user.id).all()
    return AlertList(alerts=alerts)

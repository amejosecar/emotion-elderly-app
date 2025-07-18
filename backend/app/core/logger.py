# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\core\logger.py
# logger.py
from loguru import logger
import sys
from app.core.config import settings

def configure_logging():
    logger.remove()
    logger.add(
        sys.stdout,
        level=settings.LOG_LEVEL,
        format=settings.LOG_FORMAT,
        enqueue=True,
        backtrace=True,
        diagnose=True,
    )

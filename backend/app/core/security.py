# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\core\security.py
# security.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
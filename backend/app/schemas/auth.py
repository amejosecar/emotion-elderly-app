# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\schemas\auth.py
# auth.py
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

# C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\schemas\user.py
# user.py
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True

from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSchema(BaseModel):
    username: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True  # Permite que Pydantic trabaje con modelos de ORM

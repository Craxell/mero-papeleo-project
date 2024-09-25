from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSchema(BaseModel):
    username: str
    email: EmailStr
    role: Optional[str] = "user"  # Valor por defecto para el rol

    class Config:
        orm_mode = True  # Permite que Pydantic trabaje con modelos de ORM

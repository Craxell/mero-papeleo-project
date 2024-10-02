from bson import ObjectId
from pydantic import BaseModel, EmailStr


class UserSchema(BaseModel):
    _id: str
    username: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True  # Permite convertir objetos que no son dicts directamente a pydantic models


class RoleSchema(BaseModel):
    name: str

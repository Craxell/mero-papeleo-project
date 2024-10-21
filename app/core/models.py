from typing import Optional
import pydantic
import uuid


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Document(pydantic.BaseModel):
    id: str = pydantic.Field(default_factory=generate_uuid)
    title: Optional[str] = None
    path: Optional[str] = None
    content: Optional[str] = None
    embedding: list = []


#Backend_MongoDB_Users
class Token(pydantic.BaseModel):
    access_token: str
    token_type: str = "bearer"


class UpdateUserRequest(pydantic.BaseModel):
    username: str
    email: str
    role: str
    password: str = None

class UserCreate(pydantic.BaseModel):
    username: str
    email: pydantic.EmailStr
    password: str


class UserSchema(pydantic.BaseModel):
    id: int
    username: str
    email: pydantic.EmailStr
    role: str

    class Config:
        orm_mode = True  # Permite convertir objetos que no son dicts directamente a pydantic models


class RoleSchema(pydantic.BaseModel):
    name: str

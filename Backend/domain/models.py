from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str
    hashed_password: str

from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

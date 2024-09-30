from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UpdateUserRequest(BaseModel):
    id: str
    email: str
    role: str
    password: str


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

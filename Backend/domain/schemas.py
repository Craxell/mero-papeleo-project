from pydantic import BaseModel, EmailStr

class UserSchema(BaseModel):
    username: str
    email: EmailStr
    role: str

class RoleSchema(BaseModel):
    name: str

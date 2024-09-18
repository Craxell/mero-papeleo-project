from fastapi import HTTPException, status
from domain.models import Token
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.config import settings

from domain.repositories.mongo_repository import MongoRepository


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
class LoginUseCase:
    def __init__(self, repo: MongoRepository):
        self.repo = repo

    def authenticate_user(self, username: str, password: str):
        user = self.repo.find_one("users", {"username": username})
        if not user or not pwd_context.verify(password, user["hashed_password"]):
            return False
        return user

    # def create_access_token(self, data: dict):
    #     to_encode = data.copy()
    #     expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    #     to_encode.update({"exp": expire})
    #     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    #     return encoded_jwt

    def create_access_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt


    # def login(self, username: str, password: str):
    #     user = self.authenticate_user(username, password)
    #     if not user:
    #         raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail="Credenciales inválidas",
    #             headers={"WWW-Authenticate": "Bearer"},
    #         )
    #     access_token = self.create_access_token(data={"sub": user["username"]})
    #     return {"status": "success", "message": "Inicio de sesión exitoso", "access_token": access_token, "token_type": "bearer"}

    def login(self, username: str, password: str):
        user = self.authenticate_user(username, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = self.create_access_token(data={"sub": user["username"], "username": user["username"]})
        return {
            "status": "success",
            "message": "Inicio de sesión exitoso",
            "access_token": access_token,
            "token_type": "bearer"
        }

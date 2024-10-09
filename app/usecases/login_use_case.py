from fastapi import HTTPException, status
from core.models import Token
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.configurations import settings
from adapters.mongodb_adapter import MongoDBAdapter
import logging

# Configuración del logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginUseCase:
    def __init__(self, repo: MongoDBAdapter):
        self.repo = repo

    def validate_credentials(self, username: str, password: str):
        if not username or not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nombre de usuario y la contraseña son requeridos."
            )

    def authenticate_user(self, username: str, password: str):
        user = self.repo.find_one("users", {"username": username})
        if not user:
            logger.warning(f"Intento de inicio de sesión fallido: usuario {username} no encontrado.")
            return False
        if not pwd_context.verify(password, user["password"]):
            logger.warning(f"Intento de inicio de sesión fallido: contraseña incorrecta para el usuario {username}.")
            return False
        return user

    def create_access_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def login(self, username: str, password: str):
        # Validar credenciales
        self.validate_credentials(username, password)
        
        # Autenticación de usuario
        user = self.authenticate_user(username, password)
        if not user:
            # raise HTTPException(
            #     status_code=status.HTTP_401_UNAUTHORIZED,
            #     message="Credenciales inválidas",
            #     headers={"WWW-Authenticate": "Bearer"},
            # )
            return{
                "status": "error",
                "message": "Credenciales inválidas",
                "headers": {"WWW-Authenticate": "Bearer"}
            }
        
        role = user.get("role", "user")
        access_token = self.create_access_token(data={"sub": user["username"], "username": user["username"], "role": role})
        logger.info(f"Inicio de sesión exitoso para el usuario: {username}")
        return {
            "status": "success",
            "username": username,
            "message": f"Bienvenido {username}",
            "access_token": access_token,
            "role": role,
            "token_type": "bearer"
        }

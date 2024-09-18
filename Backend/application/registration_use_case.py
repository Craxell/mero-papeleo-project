from domain.models import UserCreate, User
from domain.repositories.mongo_repository import MongoRepository
from passlib.context import CryptContext
from fastapi import HTTPException, status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RegistrationUseCase:
    def __init__(self, repo: MongoRepository):
        self.repo = repo
    
    def register(self, user_data: UserCreate):
        # Check if user with this email already exists
        existing_user_email = self.repo.find_one("users", {"email": user_data.email})
        if existing_user_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Este correo no esta disponible."
            )
        
        # Check if user with this username already exists
        existing_user_username = self.repo.find_one("users", {"username": user_data.username})
        if existing_user_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Este username no esta disponible."
            )

        hashed_password = pwd_context.hash(user_data.password)
        user = {
            "username": user_data.username,
            "email": user_data.email,
            "hashed_password": hashed_password
        }
        self.repo.insert_one("users", user)
        return {"status": "success", "message": "Usuario registrado con exito."}
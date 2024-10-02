from core.models import UserCreate
from adapters.mongo_repository import MongoRepository
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RegistrationUseCase:
    def __init__(self, repo: MongoRepository):
        self.repo = repo

    def register(self, user_data: UserCreate):
        existing_user_email = self.repo.find_one("users", {"email": user_data.email})
        if existing_user_email:
            return {
                "status": "error",
                "message": "Correo no disponible."
            }

        existing_user_username = self.repo.find_one("users", {"username": user_data.username})
        if existing_user_username:
            return {
                "status": "error",
                "message": "Username no disponible."
            }

        hashed_password = pwd_context.hash(user_data.password)

        default_role = self.repo.find_one("roles", {"name": {"$ne": "Administrador"}})


        if not default_role:
            return {
                "status": "error",
                "message": "No se encontró un rol válido por defecto."
            }

        user = {
            "username": user_data.username,
            "email": user_data.email,
            "password": hashed_password,
            "role": default_role["name"]
        }

        self.repo.insert_one("users", user)
        return {"status": "success", "message": "Usuario registrado con éxito."}

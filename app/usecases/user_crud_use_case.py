from passlib.context import CryptContext
from adapters.mongodb_adapter import MongoDBAdapter
from core.models import UserSchema

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCrudCase:
    def __init__(self, repo: MongoDBAdapter):
        self.repo = repo

    def get_all_users(self):
        users = self.repo.find_many("users")
        return [UserSchema(**{**user, "id": user["id"]}) for user in users]

    def update_user(self, user_id: int, user_data: dict):
        existing_user = self.repo.find_one("users", {"id": user_id})
        if not existing_user:
            return None  # Usuario no encontrado

        if "username" in user_data and user_data["username"] != existing_user["username"]:
            if self.repo.find_one("users", {"username": user_data["username"]}):
                raise ValueError("El nuevo nombre de usuario ya está en uso")

        if "password" in user_data and user_data["password"]:
            user_data["password"] = pwd_context.hash(user_data["password"])

        updated = self.repo.update_one("users", {"id": user_id}, {
            "username": user_data.get("username", existing_user["username"]),
            "email": user_data.get("email", existing_user["email"]),
            "role": user_data.get("role", existing_user["role"]),
            "password": user_data.get("password", existing_user["password"])
        })

        return updated.modified_count > 0

    def delete_user(self, user_id: int):
        return self.repo.delete_one("users", {"id": user_id})

    def create_user(self, user_data: dict):
        # Hashear la contraseña al crear un nuevo usuario
        if "password" in user_data and user_data["password"]:
            user_data["password"] = pwd_context.hash(user_data["password"])
        return self.repo.insert_one("users", user_data)

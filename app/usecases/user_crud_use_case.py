from passlib.context import CryptContext
from app.adapters.mongodb_adapter import MongoDBAdapter
from app.core.models import UserSchema

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
            return {"message": "Usuario no encontrado."}  # Usuario no encontrado

        # Comprobar si no se realizaron cambios
        if all(user_data.get(key) == existing_user[key] for key in user_data if key in existing_user):
            return {"message": "No se realizaron cambios en los datos del usuario."}

        if "username" in user_data and user_data["username"] != existing_user["username"]:
            if self.repo.find_one("users", {"username": user_data["username"]}):
                raise ValueError("El nuevo nombre de usuario ya está en uso")
        
        if "email" in user_data and user_data["email"] != existing_user["email"]:
            if self.repo.find_one("users", {"email": user_data["email"]}):
                raise ValueError("El nuevo email ya está en uso")

        if "password" in user_data and user_data["password"]:
            user_data["password"] = pwd_context.hash(user_data["password"])

        updated = self.repo.update_one("users", {"id": user_id}, {
            "username": user_data.get("username", existing_user["username"]),
            "email": user_data.get("email", existing_user["email"]),
            "role": user_data.get("role", existing_user["role"]),
            "password": user_data.get("password", existing_user["password"])
        })

        if updated.modified_count > 0:
            return {"message": "Usuario actualizado correctamente."}
        else:
            return {"message": "No se pudo actualizar el usuario, asegúrate de que los datos son correctos."}



    def delete_user(self, user_id: int):
        return self.repo.delete_one("users", {"id": user_id})

    def create_user(self, user_data: dict):
        # Hashear la contraseña al crear un nuevo usuario
        if "password" in user_data and user_data["password"]:
            user_data["password"] = pwd_context.hash(user_data["password"])
        return self.repo.insert_one("users", user_data)

from passlib.context import CryptContext
from bson import ObjectId
from adapters.mongo_repository import MongoRepository
from core.models import UserSchema

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCrudUseCase:
    def __init__(self, repo: MongoRepository):
        self.repo = repo

    def get_all_users(self):
        users = self.repo.find_all("users")
        return [UserSchema(**{**user, "_id": str(user["_id"])}) for user in users]




    def update_user(self, username: str, updated_user: dict):
        user = self.repo.find_one("users", {"username": username})

        if not user:
            raise ValueError("Usuario no encontrado.")

        update_fields = {}

        if 'password' in updated_user and updated_user['password']:
            update_fields['password'] = pwd_context.hash(updated_user['password'])
        
        if 'email' in updated_user and updated_user['email'] != user['email']:
            update_fields['email'] = updated_user['email']

        if 'role' in updated_user and updated_user['role'] != user['role']:
            update_fields['role'] = updated_user['role']

        if not update_fields:
            return False

        result = self.repo.update_one("users", {"username": username}, update_fields)
        return result.modified_count > 0


    def delete_user(self, user_id: str):
        return self.repo.delete_one("users", {"_id": ObjectId(user_id)})

    def create_user(self, user_data: dict):
        return self.repo.insert_one("users", user_data)

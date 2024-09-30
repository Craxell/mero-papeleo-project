from passlib.context import CryptContext
from bson import ObjectId
from domain.repositories.mongo_repository import MongoRepository
from domain.schemas import UserSchema

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCrudUseCase:
    def __init__(self, repo: MongoRepository):
        self.repo = repo

    def get_all_users(self):
        users = self.repo.find_all("users")
        return [UserSchema(**user) for user in users]

    def get_user_by_username(self, username: str):
        user = self.repo.find_one("users", {"username": username})
        return UserSchema(**user) if user else None

    def update_user(self, username: str, updated_user: dict):
        # Si la contraseña está presente y no es vacía, la hashamos
        if 'password' in updated_user and updated_user['password']:
            updated_user['password'] = pwd_context.hash(updated_user['password'])

        result = self.repo.update_one("users", {"username": username}, updated_user)
        return result.modified_count > 0

    def delete_user(self, user_id: str):
        return self.repo.delete_one("users", {"_id": ObjectId(user_id)})

    def create_user(self, user_data: dict):
        return self.repo.insert_one("users", user_data)

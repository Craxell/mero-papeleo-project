from bson import ObjectId
from domain.repositories.mongo_repository import MongoRepository
from domain.schemas import UserSchema

class UserCrudUseCase:
    def __init__(self, repo: MongoRepository):
        self.repo = repo

    def get_all_users(self):
        users = self.repo.find_all("users")
        return [UserSchema(**user) for user in users]  # Convertir cada usuario a UserSchema

    def get_user_by_id(self, user_id: str):
        user = self.repo.find_one("users", {"_id": ObjectId(user_id)})
        return UserSchema(**user) if user else None

    def update_user(self, user_id: str, updated_user: dict):
        return self.repo.update_one("users", {"_id": ObjectId(user_id)}, updated_user)

    def delete_user(self, user_id: str):
        return self.repo.delete_one("users", {"_id": ObjectId(user_id)})

    def create_user(self, user_data: dict):
        return self.repo.insert_one("users", user_data)

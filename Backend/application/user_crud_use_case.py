from domain.repositories.mongo_repository import MongoRepository


class UserCrudUseCase:
    def __init__(self, repo: MongoRepository):
        self.repo = repo

    def get_all_users(self):
        # Puedes implementar este método agregando uno que devuelva múltiples usuarios en tu `MongoRepository`.
        return self.repo.mongoClient["users"].find({}, {"_id": 0})

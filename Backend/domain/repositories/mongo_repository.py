from infrastructure.mongo_client import MongoDBClient

class MongoRepository:
    def __init__(self):
        self.mongoClient = MongoDBClient().get_databaseMongo()

    def find_one(self, collection_name: str, query: dict) -> dict:
        collection = self.mongoClient[collection_name]
        return collection.find_one(query)

    def insert_one(self, collection_name: str, document: dict):
        collection = self.mongoClient[collection_name]
        return collection.insert_one(document)

    # Agrega otros métodos según sea necesario

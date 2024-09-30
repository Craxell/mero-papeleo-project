from infrastructure.mongo_client import MongoDBClient
from typing import List, Dict

class MongoRepository:
    def __init__(self):
        self.mongoClient = MongoDBClient().get_databaseMongo()

    def find_one(self, collection_name: str, query: dict) -> dict:
        collection = self.mongoClient[collection_name]
        return collection.find_one(query)

    def find_many(self, collection_name: str, query: dict = {}) -> List[dict]:
        collection = self.mongoClient[collection_name]
        return list(collection.find(query))

    def find_all(self, collection_name: str) -> List[dict]:
        collection = self.mongoClient[collection_name]
        return list(collection.find({}))

    def insert_one(self, collection_name: str, document: dict):
        collection = self.mongoClient[collection_name]
        return collection.insert_one(document)

    def insert_many(self, collection_name: str, documents: List[dict]):
        collection = self.mongoClient[collection_name]
        return collection.insert_many(documents)

    def update_one(self, collection: str, query: dict, update: dict):
        collection_ref = self.mongoClient[collection]
        result = collection_ref.update_one(query, {"$set": update})
        return result


    def delete_one(self, collection_name: str, query: dict):
        collection = self.mongoClient[collection_name]
        return collection.delete_one(query)

    def get_roles(self) -> List[Dict[str, str]]:
        roles_collection = self.mongoClient["roles"]
        return list(roles_collection.find({}, {"_id": 0, "name": 1}))

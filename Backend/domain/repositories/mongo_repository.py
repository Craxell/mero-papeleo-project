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

    def update_one(self, collection_name: str, query: dict, update: dict):
        collection = self.mongoClient[collection_name]
        return collection.update_one(query, {'$set': update})

    def delete_one(self, collection_name: str, query: dict):
        collection = self.mongoClient[collection_name]
        return collection.delete_one(query)

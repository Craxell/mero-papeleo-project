import pymongo
from app.configurations import settings
from typing import List, Dict


class MongoDBAdapter:
    def __init__(self):
        self.mongo_client = pymongo.MongoClient(settings.MONGO_URI)
        self.db_mongo = self.mongo_client[settings.MONGO_DB_NAME]

    def get_database(self):
        """Devuelve la base de datos MongoDB."""
        return self.db_mongo

    def find_one(self, collection_name: str, query: dict) -> dict:
        """Encuentra un documento que coincida con la consulta."""
        return self.db_mongo[collection_name].find_one(query)

    def find_many(self, collection_name: str, query: dict = {}) -> List[dict]:
        """Encuentra múltiples documentos que coincidan con la consulta."""
        return list(self.db_mongo[collection_name].find(query))

    def insert_one(self, collection_name: str, document: dict):
        """Inserta un documento en la colección."""
        return self.db_mongo[collection_name].insert_one(document)

    def insert_many(self, collection_name: str, documents: List[dict]):
        """Inserta múltiples documentos en la colección."""
        return self.db_mongo[collection_name].insert_many(documents)

    def update_one(self, collection_name: str, query: dict, update: dict):
        """Actualiza un documento que coincida con la consulta."""
        return self.db_mongo[collection_name].update_one(query, {"$set": update})

    def delete_one(self, collection_name: str, query: dict):
        """Elimina un documento que coincida con la consulta."""
        return self.db_mongo[collection_name].delete_one(query)

    def get_roles(self) -> List[Dict[str, str]]:
        """Obtiene todos los roles sin los campos _id."""
        return list(self.db_mongo["roles"].find({}, {"_id": 0, "name": 1}))

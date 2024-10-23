from typing import List, Dict
from core import ports
from core.models import Document
import pymongo as pyM

class MongoDBAdapter(ports.MongoDBRepositoryPort):
    def __init__(self, uri: str, database: str, users_collection: str, documents_collection: str) -> None:
        self.client = pyM.MongoClient(uri)
        self.db = self.client[database]
        self.users = self.db[users_collection]
        self.documents = self.db[documents_collection]


    # Document methods --------------------------------
    def save_document(self, document: Document) -> None:
        self.documents.insert_one(
            {"id": document.id, "title": document.title, "path": document.path, "content": document.content})

    def get_document(self, id: str) -> Document | None:
        document = self.documents.find_one({"id": id})
        if document:
            return Document(id=document["id"], title=document["title"],
                                   path=document["path"], content=document["content"])
        return None





    def get_database(self):
        """Devuelve la base de datos MongoDB."""
        return self.db

    def get_next_sequence(self, sequence_name: str) -> int:
        """Obtiene el siguiente número de secuencia (autoincremento)."""
        sequence_doc = self.db["counters"].find_one_and_update(
            {"_id": sequence_name}, 
            {"$inc": {"seq": 1}}, 
            return_document=pyM.ReturnDocument.AFTER,
            upsert=True
        )
        return sequence_doc["seq"]

    def insert_one(self, collection_name: str, document: dict):
        """Inserta un documento en la colección."""
        if 'id' not in document:
            document['id'] = self.get_next_sequence(collection_name)  # Genera un nuevo id
        return self.db[collection_name].insert_one(document)

    def find_one(self, collection_name: str, query: dict) -> dict:
        """Encuentra un documento que coincida con la consulta."""
        return self.db[collection_name].find_one(query)

    def find_many(self, collection_name: str, query: dict = {}) -> List[dict]:
        """Encuentra múltiples documentos que coincidan con la consulta."""
        return list(self.db[collection_name].find(query))

    def insert_many(self, collection_name: str, documents: List[dict]):
        """Inserta múltiples documentos en la colección."""
        return self.db[collection_name].insert_many(documents)

    def update_one(self, collection_name: str, query: dict, update: dict):
        """Actualiza un documento que coincida con la consulta."""
        return self.db[collection_name].update_one(query, {"$set": update})

    def delete_one(self, collection_name: str, query: dict):
        """Elimina un documento que coincida con la consulta."""
        return self.db[collection_name].delete_one(query)

    def get_roles(self) -> List[Dict[str, str]]:
        """Obtiene todos los roles sin los campos _id."""
        return list(self.db["roles"].find({}, {"_id": 0, "name": 1}))

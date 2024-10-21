from typing import List, Dict
from core.models import Document
import pymongo
from configurations import settings
class MongoDBAdapter:
    def __init__(self, uri=None, database=None, users_collection=None, documents_collection=None):
        self.mongo_client = pymongo.MongoClient(uri or settings.MONGO_URI)
        self.db_mongo = self.mongo_client[database or settings.MONGO_DB_NAME]
        self.users_collection = users_collection or "users"
        self.documents_collection = documents_collection or "user_docs"

        # Inicializa las colecciones
        self.documents_collection = self.db_mongo[self.documents_collection]
        self.embeddings_collection = self.db_mongo['embeddings']

    def get_database(self):
        """Devuelve la base de datos MongoDB."""
        return self.db_mongo

    def get_next_sequence(self, sequence_name: str) -> int:
        """Obtiene el siguiente número de secuencia (autoincremento)."""
        sequence_doc = self.db_mongo["counters"].find_one_and_update(
            {"_id": sequence_name}, 
            {"$inc": {"seq": 1}}, 
            return_document=pymongo.ReturnDocument.AFTER,
            upsert=True
        )
        return sequence_doc["seq"]

    def insert_one(self, collection_name: str, document: dict):
        """Inserta un documento en la colección."""
        if 'id' not in document:
            document['id'] = self.get_next_sequence(collection_name)  # Genera un nuevo id
        return self.db_mongo[collection_name].insert_one(document)

    def find_one(self, collection_name: str, query: dict) -> dict:
        """Encuentra un documento que coincida con la consulta."""
        return self.db_mongo[collection_name].find_one(query)

    def find_many(self, collection_name: str, query: dict = {}) -> List[dict]:
        """Encuentra múltiples documentos que coincidan con la consulta."""
        return list(self.db_mongo[collection_name].find(query))

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

    def save_document(self, document: Document) -> None:
        """Guarda un documento en la colección de documentos."""
        self.insert_one(self.documents_collection.name, {
            "id": document.id,
            "title": document.title,
            "path": document.path,
            "content": document.content
        })

    def get_document(self, id: str) -> Document | None:
        """Recupera un documento por ID."""
        document = self.find_one(self.documents_collection.name, {"id": id})  # Asegúrate de usar 'id'
        if document:
            return Document(id=document["id"], title=document["title"], path=document["path"], content=document["content"])
        return None

    ### Método corregido para obtener embeddings desde la colección correcta

    def get_all_embeddings(self):
        documents = self.find_many(self.documents_collection.name)
        # Convertir ObjectId a str antes de devolver
        return [Document(**{**doc, 'id': str(doc.get('_id')), 'embedding': doc.get('embedding', [])}) for doc in documents]

    def get_all_documents(self):
        return list(self.documents_collection.name.find())
    
    def get_embedding_by_document_id(self, document_id: str) -> dict:
        """Recupera el embedding asociado a un documento específico por su document_id."""
        embedding = self.find_one(self.embeddings_collection.name, {"document_id": document_id})
        if embedding:
            return embedding.get("embedding", [])
        return None

    def save_embedding(self, document_id: str, embedding: List[float]) -> None:
        """Guarda un embedding en la colección de embeddings."""
        self.embeddings_collection.insert_one({
            "document_id": document_id,
            "embedding": embedding
        })

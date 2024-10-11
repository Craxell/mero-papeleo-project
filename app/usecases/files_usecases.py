from core import ports
from core.models import Document
from core.ports import *
from adapters import mongodb_adapter
from utils.strategies import FileReader
import os
from fastapi import UploadFile


class RAGService:
    def __init__(self, document_repo: ports.DocumentRepositoryPort, mongo_repo: mongodb_adapter.MongoDBAdapter, openai_adapter: ports.LlmPort):
        self.document_repo = document_repo
        self.mongo_repo = mongo_repo
        self.openai_adapter = openai_adapter

    # RAG methods
    def generate_answer(self, query: str) -> str:
        """Genera una respuesta basada en una consulta usando documentos recuperados."""
        documents = self.document_repo.get_documents(query, self.openai_adapter)
        print(f"Documents: {documents}")
        context = " ".join([doc.content for doc in documents])
        return self.openai_adapter.generate_text(prompt=query, retrieval_context=context)


    def _save_file_to_disk(self, file: UploadFile) -> str:
        """Guarda el archivo en el disco y devuelve la ruta del archivo guardado."""
        os.makedirs('userfiles', exist_ok=True)
        file_path = os.path.join('userfiles', file.filename)

        try:
            with open(file_path, 'wb') as f:
                f.write(file.file.read())
            return file_path
        except Exception as e:
            print(f"Failed to save file: {str(e)}")
            return ""

    def _read_file_content(self, file_path: str) -> str:
        """Lee el contenido del archivo y devuelve el contenido o un mensaje de error."""
        content = FileReader(file_path).read_file()
        return content

    def get_document(self, id: str) -> Document:
        """Recupera un documento de la base de datos."""
        return self.mongo_repo.get_document(id)

    def get_vectors(self):
        """Recupera los vectores de documentos."""
        return self.document_repo.get_vectors()

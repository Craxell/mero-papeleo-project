from core.models import Document
from adapters import mongodb_adapter
from core import ports
from utils.strategies import FileReader
import os
from fastapi import UploadFile, HTTPException


class RAGService:
    def __init__(self, document_repo: ports.DocumentRepositoryPort, mongo_repo: mongodb_adapter.MongoDBAdapter, openai_adapter: ports.LlmPort):
        self.document_repo = document_repo
        self.mongo_repo = mongo_repo
        self.openai_adapter = openai_adapter

    # RAG methods
    def generate_answer(self, query: str) -> str:
        documents = self.document_repo.get_documents(query, self.openai_adapter)
        print(f"Documents: {documents}")
        context = " ".join([doc.content for doc in documents])
        return self.openai_adapter.generate_text(prompt=query, retrieval_context=context)

    def save_document(self, file: UploadFile) -> dict:
        """Guarda el archivo en el sistema de archivos y en la base de datos."""
        file_name = file.filename

        os.makedirs('userdata', exist_ok=True)

        file_path = os.path.join('userdata', file_name)
        try:
            with open(file_path, 'wb') as f:
                f.write(file.file.read())
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

        document = Document(title=file_name, path=file_path)

        # strategies
        try:
            content = FileReader(document.path).read_file()
            if isinstance(content, str) and (content.startswith("File not found") or content.startswith("An error occurred")):
                return {"status": content}  # Devolver mensaje de error específico

            self.mongo_repo.save_document(document)
            self.document_repo.save_document(document, content, self.openai_adapter)

            return {"status": "Document saved successfully"}

        except ValueError as ve:
            return {"status": str(ve)}
        except Exception as e:
            return {"status": str(e)}



    def get_document(self, id: str) -> Document | None:
        """Recupera un documento de la base de datos."""
        document = self.mongo_repo.get_document(id)
        if document:
            return document
        return None  # Esto devuelve None si no encuentra el documento

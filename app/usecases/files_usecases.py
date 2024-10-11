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
        file_name = file.filename
        os.makedirs('userdata', exist_ok=True)
        file_path = os.path.join('userdata', file_name)
        
        # Guardar el archivo
        with open(file_path, 'wb') as f:
            f.write(file.file.read())

        document = Document(title=file_name, path=file_path)

        try:
            content = FileReader(document.path).read_file()
            if isinstance(content, str) and (content.startswith("File not found") or content.startswith("An error occurred")):
                return {"status": content}
        except Exception as e:
            return {"status": str(e)}

        document.content = content

        # Guardar en la base de datos
        self.mongo_repo.save_document(document)
        self.document_repo.save_document(document, content, self.openai_adapter)

        return {"status": "Document saved successfully"}




    def get_document(self, id: str) -> Document | None:
        """Recupera un documento de la base de datos."""
        document = self.mongo_repo.get_document(id)
        if document:
            return document
        return None  # Esto devuelve None si no encuentra el documento

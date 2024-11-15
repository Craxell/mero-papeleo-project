from core.models import Document
from helpers.strategies import FileReader
from fastapi import UploadFile
from core import ports
import os


class RAGService:
    def __init__(
        self,
        document_repo: ports.DocumentRepositoryPort,
        mongo_repo: ports.MongoDBRepositoryPort,
        openai_adapter: ports.LlmPort,
    ):
        self.document_repo = document_repo
        self.mongo_repo = mongo_repo
        self.openai_adapter = openai_adapter

    def generate_answer(self, query: str) -> str:
        documents = self.document_repo.get_documents(query, self.openai_adapter)
        print(f"Documents: {documents}")
        context = " ".join([doc.content for doc in documents])
        return self.openai_adapter.generate_text(
            prompt=query, retrieval_context=context
        )

    def save_document(self, file: UploadFile) -> dict:
        file_name = file.filename
        os.makedirs("userFiles", exist_ok=True)
        file_path = os.path.join("userFiles", file_name)
        with open(file_path, "wb") as f:
            f.write(file.file.read())

        document = Document(title=file_name, path=file_path)

        try:
            content = FileReader(document.path).read_file()
            if (
                isinstance(content, str)
                and content.startswith("File not found")
                or content.startswith("An error occurred")
            ):
                return {"status": content}  # Devolver mensaje de error específico

            self.mongo_repo.save_document(document)
            self.document_repo.save_document(document, content, self.openai_adapter)
            return {"status": "Document saved successfully"}

        except ValueError as ve:
            return {
                "status": str(ve)
            }  # Si el archivo no es soportado, devolver mensaje claro
        except Exception as e:
            return {"status": str(e)}  # Otros errores

    def get_document(self, id: str) -> Document:
        return self.mongo_repo.get_document(id)

    def get_vectors(self):
        return self.document_repo.get_vectors()

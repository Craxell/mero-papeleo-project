from core.models import Document
from adapters import mongodb_adapter, chromadb_adapter, openAI_adapter
from core import ports
from utils.strategies import FileReader
import os
from fastapi import UploadFile, HTTPException
import numpy as np  # Importar NumPy para cálculos

class RAGService:
    def __init__(self, mongo_repo, openai_adapter, document_repo):
        self.mongo_repo = mongo_repo
        self.openai_adapter = openai_adapter
        self.document_repo = document_repo

    def calculate_similarity(self, query_array, doc_array):
        cosine_similarity = np.dot(query_array, doc_array) / (np.linalg.norm(query_array) * np.linalg.norm(doc_array))
        return cosine_similarity

    # RAG methods
    def generate_answer(self, query: str) -> str:
        documents = self.get_documents(query)
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

        # Guardar en MongoDB y generar embedding
        self.save_document_with_embeddings(document, content)

        return {"status": "Document saved successfully"}

    def save_document_with_embeddings(self, document: Document, content: str):
        # Generar el embedding con OpenAI
        embedding = self.openai_adapter.generate_embedding(content)

        # Guardar el documento en MongoDB
        self.mongo_repo.save_document(document)

        # Guardar el documento y su embedding en ChromaDB
        self.document_repo.save_document(document, content, self.openai_adapter)

    def get_documents(self, query: str) -> list:
        # Generar el embedding de la consulta usando el adaptador de OpenAI
        query_embedding = self.openai_adapter.generate_embedding(query)
        
        documents = self.mongo_repo.get_all_documents()  # Recuperar todos los documentos
        relevant_documents = []  # Lista para almacenar documentos relevantes

        for doc in documents:
            similarity = self.calculate_similarity(query_embedding, doc.embedding)
            if similarity > 0.7:
                relevant_documents.append(doc)

        return relevant_documents

    def save_embedding(self, document: Document, embedding):
        self.mongo_repo.save_embedding(document.id, embedding)

    def get_vectors(self):
        """
        Obtiene todos los vectores (embeddings) almacenados en la colección de MongoDB.
        """
        try:
            # Usar el repositorio para recuperar todos los embeddings
            vectors = self.mongo_repo.get_all_embeddings()
            return {
                "status": "success",
                "data": vectors
            }
        except Exception as e:
            # En caso de error, lo registramos y devolvemos un mensaje de error
            return {
                "status": "error",
                "message": str(e)
            }

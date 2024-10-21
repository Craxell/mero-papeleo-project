from abc import ABC
import chromadb
import numpy as np
from typing import List
from core import ports
from core import models
from utils.vectorize_docs import document_to_vectors, get_openai_embeddings


class ChromaDBAdapter(ports.DocumentRepositoryPort, ABC):
    def __init__(self, number_of_vectorial_results: int) -> None:
        self.client = chromadb.Client()
        self.collection = self.client.create_collection("documents")
        self._number_of_vectorial_results = number_of_vectorial_results

    def save_document(self, document: models.Document, content: str, openai_client) -> None:
        embeddings_document = document_to_vectors(content, openai_client)
        
        combined_embedding = np.mean(embeddings_document, axis=0).tolist() if len(embeddings_document) > 1 else embeddings_document[0]

        existing_doc = self.collection.get(ids=[document.id])
        if existing_doc and len(existing_doc['ids']) > 0:
            print(f"Documento con ID {document.id} ya existe, omitiendo la inserción.")
            return

        self.collection.add(
            ids=[document.id],
            embeddings=[combined_embedding],
            documents=[content]
        )
        print(f"Documento con ID {document.id} guardado correctamente.")


    def get_documents(self, query: str, openai_client, n_results: int | None = None) -> List[models.Document]:
        if not n_results:
            n_results = self._number_of_vectorial_results

        query_embedding = get_openai_embeddings(query, openai_client)
        results = self.collection.query(query_embeddings=[query_embedding], n_results=n_results)

        print(f"Resultados de la consulta: {results}")

        documents = []
        for i, doc_id_list in enumerate(results['ids']):
            for doc_id in doc_id_list:
                doc_content = results['documents'][i][0]  # Verificar si esto es correcto
                documents.append(models.Document(id=doc_id, content=doc_content))

        return documents


    def get_vectors(self):
        """Devuelve los vectores almacenados en la colección."""
        return self.collection.get(include=['embeddings', 'documents', 'metadatas'])

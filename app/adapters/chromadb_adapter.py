import chromadb
class chromaDBAdapter():
    def __init__(self):
        self.chromadb = chromadb

    client = chromadb.Client()
    collection = client.create_collection(name="test_collection")
    
    try:
        collection.add(
            documents=[
                "Fruits are an amazing part of nature's bounty, offering a vibrant and delicious array of flavors and health benefits. From the juicy sweetness of a ripe mango to the tangy freshness of a lemon, there's a fruit for every taste and occasion.", 
                "Take the humble apple, for instance. This iconic fruit is not only a popular snack but also a symbol of health and wellness. With its crisp texture and slightly sweet taste, it's a favorite among many. And let's not forget the nutritional value; apples are packed with vitamins, fiber, and antioxidants, making them a true superfood.",
                "Then there's the tropical paradise of fruits like pineapple and papaya. Pineapple, with its spiky exterior and vibrant yellow flesh, is a tropical treat. It's not just about the taste, though; pineapple is also known for its anti-inflammatory properties and digestive benefits. Papaya, on the other hand, is a gentle giant with its soft, buttery texture and subtle sweetness. It's a great source of vitamins A and C, and its enzymes are said to aid in digestion.",
                "The world of fruits is truly diverse, offering a rainbow of colors and a symphony of flavors. Whether you prefer the classic apple, the exotic pineapple, or the many other fruits in between, there's always a new taste adventure waiting to be discovered."
            ],
            ids=["id1", "id2","id3","id4"]
    )
    except Exception as e:
        print(e)

    def get_collection(self):
        return self.collection

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

        # Si hay más de un embedding, combinarlo promediando
        if len(embeddings_document) > 1:
            combined_embedding = np.mean(embeddings_document, axis=0).tolist()
        else:
            combined_embedding = embeddings_document[0]

        # Agregar el documento a ChromaDB con su embedding
        self.collection.add(
            ids=[document.id],
            embeddings=[combined_embedding],  # Aseguramos que sea una lista de embeddings
            documents=[content]
        )

    def get_documents(self, query: str, openai_client, n_results: int | None = None) -> List[models.Document]:
        if not n_results:
            n_results = self._number_of_vectorial_results

        # Generar embedding para la query usando OpenAI
        query_embedding = get_openai_embeddings(query, openai_client)

        # Hacer la consulta usando los embeddings de la query
        results = self.collection.query(query_embeddings=[query_embedding], n_results=n_results)

        # Procesar los resultados y devolver documentos
        documents = []
        for i, doc_id_list in enumerate(results['ids']):
            for doc_id in doc_id_list:
                documents.append(models.Document(id=doc_id, content=results['documents'][i][0]))
        return documents

    def get_vectors(self):
        """Devuelve los vectores almacenados en la colección."""
        return self.collection.get(include=['embeddings', 'documents', 'metadatas'])
from abc import ABC, abstractmethod
from typing import List
from core import models

class DocumentRepositoryPort(ABC):
    @abstractmethod
    def save_document(self, document: models.Document, content: str, openai_client) -> None:
        pass

    @abstractmethod
    def get_documents(self, query: str, openai_client, n_results: int | None = None) -> List[models.Document]:
        pass

    @abstractmethod
    def get_vectors(self):
        pass



class LlmPort(ABC):
    @abstractmethod
    def generate_text(self, prompt: str, retrieval_context: str) -> str:
        pass
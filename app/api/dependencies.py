from adapters.openAI_adapter import OpenAIAdapter
from adapters.chromadb_adapter import ChromaDBAdapter
from adapters.mongodb_adapter import MongoDBAdapter
from app import configurations
from usecases import RAG_Usecases
from usecases.RAG_Usecases import RAGService


class RAGServiceSingleton:
    _instance = None

    @classmethod
    def get_instance(cls) -> RAGService:
        if cls._instance is None:
            configs = configurations.Settings()
            openai_adapter = OpenAIAdapter(
                api_key=configs.OPENAI_API_KEY,
                model=configs.MODEL,
                max_tokens=configs.MAX_TOKENS,
                temperature=configs.TEMPERATURE,
            )
            # document_repo = ports.DocumentRepositoryPort()
            document_repo = ChromaDBAdapter(
                number_of_vectorial_results=configs.NUMBER_OF_VECTORIAL_RESULTS
            )
            mongo_repo = MongoDBAdapter(
                uri=configs.MONGO_URI,
                database=configs.MONGO_DB_NAME,
                users_collection=configs.MONGO_COLLECTION_USERS,
                documents_collection=configs.MONGO_COLLECTION_DOCUMENTS,
            )
            cls._instance = RAG_Usecases.RAGService(
                document_repo=document_repo,
                mongo_repo=mongo_repo,
                openai_adapter=openai_adapter,
            )
        return cls._instance

from adapters.openAI_adapter import OpenAIAdapter
from adapters.chromadb_adapter import ChromaDBAdapter
from adapters.mongodb_adapter import MongoDBAdapter
from app import configurations
from usecases.files_usecases import RAGService


class RAGServiceSingleton:
    _instance = None

    @classmethod
    # def get_instance(cls) -> RAGService:
    #     if cls._instance is None:
    #         configs = configurations.Settings()
    #         openai_adapter = OpenAIAdapter(api_key=configs.OPENAI_API_KEY, model=configs.MODEL,
    #             max_tokens=configs.MAX_TOKENS, temperature=configs.TEMPERATURE)
    #         document_repo = ChromaDBAdapter(number_of_vectorial_results=configs.NUMBER_OF_VECTORIAL_RESULTS)
    #         mongo_repo = MongoDBAdapter(uri=configs.MONGO_URI, database=configs.MONGO_DB_NAME, users_collection=configs.MONGO_COLLECTION_USERS,
    #             documents_collection=configs.MONGO_COLLECTION_DOCUMENTS)
    #         cls._instance = RAGService(document_repo=document_repo, mongo_repo=mongo_repo, openai_adapter=openai_adapter)
    #     return cls._instance


    def get_instance(cls) -> RAGService:
        if cls._instance is None:
            configs = configurations.Settings()

            #Instancia adapters

            openai_adapter = OpenAIAdapter(
                api_key=configs.OPENAI_API_KEY,
                model=configs.MODEL,
                max_tokens=configs.MAX_TOKENS,
                temperature=configs.TEMPERATURE
            )

            document_repo = ChromaDBAdapter(
                number_of_vectorial_results=configs.NUMBER_OF_VECTORIAL_RESULTS
            )

            mongo_repo = MongoDBAdapter(
                uri=configs.MONGO_URI, 
                database=configs.MONGO_DB_NAME, 
                users_collection=configs.MONGO_COLLECTION_USERS,
                documents_collection=configs.MONGO_COLLECTION_DOCUMENTS
            )


            cls._instance = RAGService(
                document_repo=document_repo,
                mongo_repo=mongo_repo,
                openai_adapter=openai_adapter
            )

            return cls._instance
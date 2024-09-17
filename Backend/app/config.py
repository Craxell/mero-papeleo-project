from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Configuración de la aplicación
    APP_HOST: str
    APP_PORT: int
    
    # Configuración para MongoDB
    MONGO_URI: str
    MONGO_DB_NAME: str
    
    # Configuración para ChromaDB
    CHROMADB_URI: str

    class Config:
        env_file = ".env"

settings = Settings()

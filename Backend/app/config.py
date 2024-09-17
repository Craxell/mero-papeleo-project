import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Configuración de la aplicación
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    
    # Configuración para MongoDB
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "mydatabase"
    
    # Configuración para ChromaDB
    CHROMADB_URI: str = "http://localhost:8001"
    
    class Config:
        env_file = ".env"

settings = Settings()

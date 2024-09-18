from pydantic_settings import BaseSettings
from pathlib import Path

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
        # Determina la ruta raíz del proyecto (sube dos niveles desde Backend/app/)
        project_root = Path(__file__).resolve().parents[2]
        env_file = project_root / ".env"
        # Busca el archivo .env en la raíz del proyecto

settings = Settings()

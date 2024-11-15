import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

import uvicorn
from configurations import settings
from api.routers import router


app = FastAPI()

# Configuración CORS
origins = [
    settings.APP_HOST,
    settings.REACT_VITE_CONNECTION,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


# Si el archivo es ejecutado directamente, iniciar Uvicorn
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app", host=settings.APP_HOST, port=settings.APP_PORT, reload=True
    )

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from domain.models import UserCreate
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from application.registration_use_case import RegistrationUseCase
from application.login_use_case import LoginUseCase
from application.user_crud_use_case import UserCrudUseCase
from domain.repositories.mongo_repository import MongoRepository


import uvicorn
from config import settings

app = FastAPI()

# Configuración CORS
origins = [
    settings.APP_HOST,
    settings.REACT_VITE_CONNECTION,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear instancia del repositorio
repo = MongoRepository()

# Rutas para registro, login y CRUD de usuarios
@app.post("/register")
async def register(user_data: UserCreate, use_case: RegistrationUseCase = Depends(lambda: RegistrationUseCase(repo))):
    try:
        return use_case.register(user_data)
    except ValueError as e:
        return {"error": str(e)}


@app.post("/login")
async def login(credentials: dict, use_case: LoginUseCase = Depends(lambda: LoginUseCase(repo))):
    return use_case.login(credentials["username"], credentials["password"])

@app.get("/users")
async def list_users(use_case: UserCrudUseCase = Depends(lambda: UserCrudUseCase(repo))):
    return use_case.get_all_users()

# Si el archivo es ejecutado directamente, iniciar Uvicorn
if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.APP_HOST, port=settings.APP_PORT, reload=True)

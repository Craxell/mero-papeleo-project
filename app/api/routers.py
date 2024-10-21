from typing import List
from fastapi import APIRouter, File, HTTPException, Depends, UploadFile
from pydantic import BaseModel, Field
from core import models
from core.models import *
from adapters.mongodb_adapter import MongoDBAdapter
from usecases.registration_use_case import RegistrationUseCase
from usecases.login_use_case import LoginUseCase
from usecases.user_crud_use_case import UserCrudCase

from usecases import files_usecases


from api import dependencies

# Repositorio de MongoDB
repo = MongoDBAdapter()
router = APIRouter()

@router.post("/register")
async def register(user_data: UserCreate, use_case: RegistrationUseCase = Depends(lambda: RegistrationUseCase(repo))):
    try:
        return use_case.register(user_data)
    except ValueError as e:
        return {"error": str(e)}

@router.post("/login")
async def login(credentials: dict, use_case: LoginUseCase = Depends(lambda: LoginUseCase(repo))):
    return use_case.login(credentials["username"], credentials["password"])

@router.get("/users", response_model=List[UserSchema])
async def get_all_users(use_case: UserCrudCase = Depends(lambda: UserCrudCase(repo))):
    users = use_case.get_all_users()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users

@router.put("/users/{id}")
async def update_user(id: int, user_data: UpdateUserRequest, use_case: UserCrudCase = Depends(lambda: UserCrudCase(repo))):
    try:
        result = use_case.update_user(id, user_data.dict(exclude_unset=True))
        if result is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        if result is True:
            return {"message": "Usuario actualizado correctamente"}
        return {"message": result}  # Manejar el caso de no cambios
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        print(f"Error al actualizar el usuario: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@router.delete("/users/{id}")
async def delete_user(id: int, use_case: UserCrudCase = Depends(lambda: UserCrudCase(repo))):
    try:
        deleted = use_case.delete_user(id)
        if not deleted:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "Usuario eliminado correctamente"}
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        print(f"Error al eliminar el usuario: {e}")
        raise HTTPException(status_code=500, detail="No se pudo eliminar el usuario")

@router.get("/roles", response_model=list[RoleSchema])
async def get_roles():
    roles = repo.get_roles()
    return roles



# @router.post("/save-document", status_code=201)
# def save_document(file: UploadFile = File(...),rag_service: files_usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
#     return rag_service.save_document(file)

# @router.get("/get-document")
# def get_document(document_id: str, rag_service: files_usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
#     document = rag_service.get_document(document_id)
#     if document:
#         return document
#     raise HTTPException(status_code=404, detail="Document not found")



# @router.get("/get-vectors", status_code=201)
# def get_vectors(rag_service: files_usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
#     return rag_service.get_vectors()


# class QueryRequest(BaseModel):
#     query: str

# @router.post("/generate-answer", status_code=201)
# async def generate_answer(request: QueryRequest, rag_service: files_usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
#     answer = rag_service.generate_answer(request.query)  # Usamos request.query aquí
#     return {"answer": answer}





class DocumentInput(BaseModel):
    content: str = Field(..., min_length=1)

@router.post("/save-document", status_code=201)
def save_document(file: UploadFile = File(...), rag_service: files_usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    return rag_service.save_document(file)

@router.get("/get-document/{document_id}", response_model=models.Document)  # Especifica el modelo de respuesta
def get_document(document_id: str, rag_service: files_usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    document = rag_service.mongo_repo.get_document(document_id)  # Asegúrate de que tu repositorio tenga este método
    if document:
        return document
    raise HTTPException(status_code=404, detail="Document not found")

# @router.get("/get-vectors", status_code=200)  # Cambié el código de estado a 200 para el éxito
# def get_vectors(rag_service: files_usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
#     return rag_service.get_vectors()

class QueryRequest(BaseModel):
    query: str

@router.post("/generate-answer", status_code=201)
async def generate_answer(request: QueryRequest, rag_service: files_usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    answer = rag_service.generate_answer(request.query)  # Usamos request.query aquí
    return {"answer": answer}



@router.get("/get-embeddings", response_model=dict, status_code=200)
def get_embeddings(rag_service: files_usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    """
    Obtiene todos los embeddings almacenados en ChromaDB.
    """
    return rag_service.document_repo.get_vectors() 
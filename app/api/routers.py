from typing import List
from fastapi import APIRouter, File, HTTPException, Depends, UploadFile
from pydantic import BaseModel
from core.models import *
from adapters.mongodb_adapter import MongoDBAdapter
from usecases import files_usecases
from usecases.files_usecases import RAGService
from usecases.registration_use_case import RegistrationUseCase
from usecases.login_use_case import LoginUseCase
from usecases.user_crud_use_case import UserCrudCase

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
        print(f"Error al actualizar el usuario: {e}")  # Asegúrate de que se imprima el error
        raise HTTPException(status_code=500, detail=str(e))  # Incluye el mensaje de error en la respuesta



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



class DocumentInput(BaseModel):
    content: str = pydantic.Field(..., min_length=1)

@router.get("/generate-answer", status_code=201)
def generate_answer(query: str,
        rag_service: RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    return rag_service.generate_answer(query)



@router.get("/get-document")
def get_document(document_id: str,
        rag_service: RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    document = rag_service.get_document(document_id)
    if document:
        return document
    return {"status": "Document not found"}

@router.get("/get-vectors", status_code=201)
def get_vectors(rag_service: RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    return rag_service.get_vectors()






@router.post("/save-document", status_code=201)
async def save_doc(file: UploadFile = File(...)):
    file_path = files_usecases._save_file_to_disk(file)
    if file_path:
        return {"status": "success", "message": "File uploaded successfully", "file_path": file_path}
    else:
        return {"status": "error", "message": "Failed to upload file"}
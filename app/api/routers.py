from typing import List
from fastapi import APIRouter, HTTPException, Depends
from core.models import *
from adapters.mongodb_adapter import MongoDBAdapter


from usecases.registration_use_case import RegistrationUseCase
from usecases.login_use_case import LoginUseCase
from usecases.user_crud_use_case import UserCrudUseCase


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
async def get_all_users(use_case: UserCrudUseCase = Depends(lambda: UserCrudUseCase(repo))):
    users = use_case.get_all_users()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users

@router.put("/users/{username}")
async def update_user(username: str, user_data: UpdateUserRequest, use_case: UserCrudUseCase = Depends(lambda: UserCrudUseCase(repo))):
    try:
        updated = use_case.update_user(username, user_data.dict(exclude_unset=True))
        if not updated:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "Usuario actualizado correctamente"}
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        print(f"Error al actualizar el usuario: {e}")
        raise HTTPException(status_code=500, detail="No se pudo guardar los cambios")



@router.get("/roles", response_model=list[RoleSchema])
async def get_roles():
    roles = repo.get_roles()
    return roles

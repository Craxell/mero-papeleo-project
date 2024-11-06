import pytest
from unittest.mock import ANY, Mock
from fastapi import HTTPException
from app.usecases.login_use_case import LoginUseCase
from app.usecases.registration_use_case import RegistrationUseCase
from app.usecases.user_crud_use_case import UserCrudCase
from jose import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.adapters.mongodb_adapter import MongoDBAdapter
from app.core.models import UserSchema
from app.core.models import Token
from app.core.models import UserCreate


# Configuración global
SECRET_KEY = "secGPs234"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



@pytest.fixture
def mock_repo():
    return Mock()

@pytest.fixture
def login_use_case_fixture(mock_repo):
    return LoginUseCase(repo=mock_repo)

def test_login_success(login_use_case_fixture, mock_repo):
    # Configurar el mock para un usuario válido
    mock_repo.find_one.return_value = {
        "username": "testuser",
        "password": pwd_context.hash("testpass"),
        "email": "testuser@example.com",
        "role": "user",
        "id": "user_id"
    }

    result = login_use_case_fixture.login("testuser", "testpass")
    
    assert result["status"] == "success"
    assert result["username"] == "testuser"
    assert result["email"] == "testuser@example.com"
    assert result["role"] == "user"
    assert "access_token" in result
    assert result["token_type"] == "bearer"

def test_login_fail_invalid_credentials(login_use_case_fixture, mock_repo):
    # Configurar el mock para un usuario válido pero con una contraseña incorrecta
    mock_repo.find_one.return_value = {
        "username": "testuser",
        "password": pwd_context.hash("testpass")
    }

    result = login_use_case_fixture.login("testuser", "wrongpass")
    
    assert result["status"] == "error"
    assert result["message"] == "Credenciales inválidas"



def test_authenticate_user_success(login_use_case_fixture, mock_repo):
    # Configurar el mock para simular un usuario encontrado con la contraseña correcta
    mock_repo.find_one.return_value = {
        "username": "testuser",
        "password": pwd_context.hash("testpass")  # Almacena la contraseña hasheada
    }

    user = login_use_case_fixture.authenticate_user("testuser", "testpass")
    
    assert user is not False
    assert user["username"] == "testuser"

def test_authenticate_user_fail_username_not_found(login_use_case_fixture, mock_repo):
    # Configurar el mock para simular que no se encuentra el usuario
    mock_repo.find_one.return_value = None
    
    result = login_use_case_fixture.authenticate_user("unknownuser", "testpass")
    
    assert result is False  # Debería retornar False

def test_authenticate_user_fail_wrong_password(login_use_case_fixture, mock_repo):
    # Configurar el mock para simular un usuario con contraseña incorrecta
    mock_repo.find_one.return_value = {
        "username": "testuser",
        "password": pwd_context.hash("testpass")  # Almacena la contraseña hasheada
    }
    
    result = login_use_case_fixture.authenticate_user("testuser", "wrongpass")
    
    assert result is False  # Debería retornar False

## Test user_crud_use_case.py 

@pytest.fixture
def mock_repo_crud():
    return Mock(spec=MongoDBAdapter)

@pytest.fixture
def user_crud_case(mock_repo_crud):
    return UserCrudCase(repo=mock_repo_crud)

def test_get_all_users(user_crud_case, mock_repo_crud):
    # Mock the repository's find_many method
    mock_repo_crud.find_many.return_value = [
        {"id": 1, "username": "user1", "email": "user1@example.com", "role": "user"},
        {"id": 2, "username": "user2", "email": "user2@example.com", "role": "user"}
    ]
    
    users = user_crud_case.get_all_users()
    
    assert len(users) == 2
    assert users[0].username == "user1"
    assert users[1].username == "user2"
    mock_repo_crud.find_many.assert_called_once_with("users")


def test_update_user_no_changes(user_crud_case, mock_repo_crud):
    # Mock the repository's find_one method
    mock_repo_crud.find_one.return_value = {"id": 1, "username": "user1", "email": "user1@example.com", "password": "hashedpassword"}
    
    user_data = {"username": "user1", "email": "user1@example.com"}
    response = user_crud_case.update_user(1, user_data)
    
    assert response["message"] == "No se realizaron cambios en los datos del usuario."
    mock_repo_crud.find_one.assert_called_once_with("users", {"id": 1})

def test_update_user_username_in_use(user_crud_case, mock_repo_crud):
    # Mock the repository's find_one method
    mock_repo_crud.find_one.side_effect = [
        {"id": 1, "username": "user1", "email": "user1@example.com", "password": "hashedpassword"},
        {"id": 2, "username": "newuser"}  # User with the new username already exists
    ]
    
    user_data = {"username": "newuser"}
    with pytest.raises(ValueError, match="El nuevo nombre de usuario ya está en uso"):
        user_crud_case.update_user(1, user_data)
    
    mock_repo_crud.find_one.assert_any_call("users", {"id": 1})
    mock_repo_crud.find_one.assert_any_call("users", {"username": "newuser"})

def test_update_user_email_in_use(user_crud_case, mock_repo_crud):
    # Mock the repository's find_one method
    mock_repo_crud.find_one.side_effect = [
        {"id": 1, "username": "user1", "email": "user1@example.com", "password": "hashedpassword"},
        {"id": 2, "email": "newuser@example.com"}  # User with the new email already exists
    ]
    
    user_data = {"email": "newuser@example.com"}
    with pytest.raises(ValueError, match="El nuevo email ya está en uso"):
        user_crud_case.update_user(1, user_data)
    
    mock_repo_crud.find_one.assert_any_call("users", {"id": 1})
    mock_repo_crud.find_one.assert_any_call("users", {"email": "newuser@example.com"})


def test_update_user_not_found(user_crud_case, mock_repo_crud):
    # Mock repo para simular que no encuentra el usuario
    mock_repo_crud.find_one.return_value = None
    
    result = user_crud_case.update_user(user_id=1, user_data={})
    
    assert result == {"message": "Usuario no encontrado."}


def test_update_user_no_changes(user_crud_case, mock_repo_crud):
    # Mock para encontrar al usuario actual
    mock_repo_crud.find_one.side_effect = [
        {"id": 1, "username": "user", "password": "old_hash", "email": "old_email"},  # Usuario existente
        None  # No hay duplicado en el nombre de usuario
    ]
    mock_repo_crud.update_one.return_value.modified_count = 0  # Simula que no se realizó la actualización

    result = user_crud_case.update_user(user_id=1, user_data={"username": "user"})
    assert result == {"message": "No se realizaron cambios en los datos del usuario."}




def test_update_user_password_change(user_crud_case, mock_repo_crud):
    # Mock para simular la búsqueda de un usuario existente y que no hay conflictos en el nombre de usuario
    mock_repo_crud.find_one.side_effect = [
        {"id": 1, "username": "user", "password": "old_hash", "email": "old_email", "role": "user_role"},  # Usuario existente
        None  # No hay duplicado en el nombre de usuario
    ]
    mock_repo_crud.update_one.return_value.modified_count = 1  # Simula actualización exitosa

    # Llama a update_user y verifica el resultado
    result = user_crud_case.update_user(user_id=1, user_data={"password": "new_password"})
    assert result == {"message": "Usuario actualizado correctamente."}  # Cambia a 'correctamente'


def test_update_user_success(user_crud_case, mock_repo_crud):
    # Mock para encontrar al usuario actual
    mock_repo_crud.find_one.side_effect = [
        {"id": 1, "username": "user", "password": "old_hash", "email": "old_email", "role": "user_role"},  # Usuario existente
        None  # No hay duplicado en el nombre de usuario
    ]
    mock_repo_crud.update_one.return_value.modified_count = 1  # Simula actualización exitosa

    # Llama a update_user y verifica el resultado
    result = user_crud_case.update_user(user_id=1, user_data={"username": "new_user"})
    assert result == {"message": "Usuario actualizado correctamente."}  # Cambia a 'correctamente'







## Test registration_use_case.py 


@pytest.fixture
def mock_repo_register():
    return Mock(spec=MongoDBAdapter)


@pytest.fixture
def register_fixture(mock_repo_register):
    return RegistrationUseCase(repo=mock_repo_register)


def test_register_success(register_fixture, mock_repo_register):
    # Configurar el mock para simular que no existe el email ni el username, y hay un rol por defecto
    mock_repo_register.find_one.side_effect = [None, None, {"name": "user"}]

    user_data = UserCreate(username="testuser", email="testuser@example.com", password="testpass")
    result = register_fixture.register(user_data)
    
    assert result["status"] == "success"
    assert result["message"] == "Usuario registrado con éxito."
    mock_repo_register.insert_one.assert_called_once_with("users", {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": ANY, #pwd_context.hash("testpass"),Ignoramos esto puesto que los hash se generan diferente Prueba aqui -> app\test\pruebaHashes.py
        "role": "user"
    })



def test_register_fail_email_exists(register_fixture, mock_repo_register):
    # Configurar el mock para simular que el email ya existe
    mock_repo_register.find_one.side_effect = [{"email": "testuser@example.com"}, None]

    user_data = UserCreate(username="testuser", email="testuser@example.com", password="testpass")
    result = register_fixture.register(user_data)
    
    assert result["status"] == "error"
    assert result["message"] == "Correo no disponible."

def test_register_fail_username_exists(register_fixture, mock_repo_register):
    # Configurar el mock para simular que el username ya existe
    mock_repo_register.find_one.side_effect = [None, {"username": "testuser"}]

    user_data = UserCreate(username="testuser", email="newuser@example.com", password="testpass")
    result = register_fixture.register(user_data)
    
    assert result["status"] == "error"
    assert result["message"] == "Username no disponible."






from fastapi.testclient import TestClient
import pytest
from app.main import app

client = TestClient(app)

@pytest.fixture(scope="module")
def test_user():
    return {
        "username": "testE2E2",
        "password": "testpassword",
        "email": "test@e2e2.com"
    
    }

# Prueba End-to-End
def test_e2e_user_registration_login_deletion():
    # 1. Registro de usuario
    registration_response = client.post("/register", json=test_user)
    assert registration_response.status_code == 200
    assert registration_response.json().get("message") == "Usuario registrado con éxito."

    # 2. Obtener el ID del usuario recién registrado
    users_response = client.get("/users")
    assert users_response.status_code == 200
    users = users_response.json()
    user_id = next((user["id"] for user in users if user["username"] == test_user["username"]), None)
    assert user_id is not None, "El usuario recién creado no se encuentra en la lista de usuarios"

    # 3. Inicio de sesión del usuario
    login_response = client.post("/login", json={
        "username": test_user["username"],
        "password": test_user["password"]
    })
    assert login_response.status_code == 200
    assert "access_token" in login_response.json(), "Token de acceso no encontrado en la respuesta de login"

    # 4. Eliminación del usuario
    deletion_response = client.delete(f"/users/{user_id}")
    assert deletion_response.status_code == 200
    assert deletion_response.json().get("message") == "Usuario eliminado correctamente"

    # 5. Comprobar que el usuario ya no existe
    get_users_response = client.get("/users")
    assert get_users_response.status_code == 200
    remaining_users = get_users_response.json()
    assert user_id not in [user['id'] for user in remaining_users], "El usuario no fue eliminado correctamente"
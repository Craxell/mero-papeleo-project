import pytest
from unittest.mock import Mock
from fastapi import HTTPException
from app.usecases.login_use_case import LoginUseCase  # Ensure correct import
from app.usecases.user_crud_use_case import UserCrudCase
from jose import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.adapters.mongodb_adapter import MongoDBAdapter
from app.core.models import UserSchema
from app.core.models import Token


# Configuración global
SECRET_KEY = "testsecretkey"
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

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@pytest.fixture
def mock_repo():
    return Mock(spec=MongoDBAdapter)

@pytest.fixture
def user_crud_case(mock_repo):
    return UserCrudCase(repo=mock_repo)

def test_get_all_users(user_crud_case, mock_repo):
    # Mock the repository's find_many method
    mock_repo.find_many.return_value = [
        {"id": 1, "username": "user1", "email": "user1@example.com", "role": "user"},
        {"id": 2, "username": "user2", "email": "user2@example.com", "role": "user"}
    ]
    
    users = user_crud_case.get_all_users()
    
    assert len(users) == 2
    assert users[0].username == "user1"
    assert users[1].username == "user2"
    mock_repo.find_many.assert_called_once_with("users")

def test_update_user_success(user_crud_case, mock_repo):
    # Mock the repository's find_one and update methods
    mock_repo.find_one.side_effect = [
        {"id": 1, "username": "user1", "email": "user1@example.com", "password": "hashedpassword"},
        None  # No user with the new username or email
    ]
    
    user_data = {"username": "newuser", "email": "newuser@example.com", "password": "newpassword"}
    response = user_crud_case.update_user(1, user_data)
    
    assert response["message"] == "Usuario actualizado correctamente."
    mock_repo.find_one.assert_any_call("users", {"id": 1})
    mock_repo.find_one.assert_any_call("users", {"username": "newuser"})
    mock_repo.find_one.assert_any_call("users", {"email": "newuser@example.com"})
    mock_repo.update.assert_called_once_with("users", {"id": 1}, user_data)

def test_update_user_no_changes(user_crud_case, mock_repo):
    # Mock the repository's find_one method
    mock_repo.find_one.return_value = {"id": 1, "username": "user1", "email": "user1@example.com", "password": "hashedpassword"}
    
    user_data = {"username": "user1", "email": "user1@example.com"}
    response = user_crud_case.update_user(1, user_data)
    
    assert response["message"] == "No se realizaron cambios en los datos del usuario."
    mock_repo.find_one.assert_called_once_with("users", {"id": 1})

def test_update_user_username_in_use(user_crud_case, mock_repo):
    # Mock the repository's find_one method
    mock_repo.find_one.side_effect = [
        {"id": 1, "username": "user1", "email": "user1@example.com", "password": "hashedpassword"},
        {"id": 2, "username": "newuser"}  # User with the new username already exists
    ]
    
    user_data = {"username": "newuser"}
    with pytest.raises(ValueError, match="El nuevo nombre de usuario ya está en uso"):
        user_crud_case.update_user(1, user_data)
    
    mock_repo.find_one.assert_any_call("users", {"id": 1})
    mock_repo.find_one.assert_any_call("users", {"username": "newuser"})

def test_update_user_email_in_use(user_crud_case, mock_repo):
    # Mock the repository's find_one method
    mock_repo.find_one.side_effect = [
        {"id": 1, "username": "user1", "email": "user1@example.com", "password": "hashedpassword"},
        {"id": 2, "email": "newuser@example.com"}  # User with the new email already exists
    ]
    
    user_data = {"email": "newuser@example.com"}
    with pytest.raises(ValueError, match="El nuevo email ya está en uso"):
        user_crud_case.update_user(1, user_data)
    
    mock_repo.find_one.assert_any_call("users", {"id": 1})
    mock_repo.find_one.assert_any_call("users", {"email": "newuser@example.com"})




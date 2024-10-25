import pytest
from unittest.mock import Mock
from fastapi import HTTPException
from app.usecases.login_use_case import LoginUseCase  # Ensure correct import
from jose import jwt
from datetime import datetime, timedelta
from app.core.models import Token
from passlib.context import CryptContext

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




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
    return LoginUseCase(repo=mock_repo)  # Ensure this is a callable class or function

def test_validate_credentials_success(login_use_case_fixture):
    # Caso donde username y password están presentes
    login_use_case_fixture.validate_credentials(username="testuser", password="testpass")
    # No se espera ninguna excepción, por lo que la prueba pasará si no hay errores.

def test_validate_credentials_fail(login_use_case_fixture):
    # Caso donde username o password están vacíos
    with pytest.raises(HTTPException):
        login_use_case_fixture.validate_credentials(username="", password="testpass")
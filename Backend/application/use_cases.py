import hashlib
import os
from domain.repositories.mongo_repository import MongoRepository

class LoginUseCase:
    def __init__(self):
        self.repo = MongoRepository()

    def get_user_from_db(self, username):
        collection_name = "users"
        query = {"username": username}
        return self.repo.find_one(collection_name, query)
    
    def execute(self, username, password):
        user = self.get_user_from_db(username)
        
        if user and self.verify_password(password, user["password"], user["salt"]):
            return {"status": "success", "message": "Login successful"}
        else:
            return {"status": "error", "message": "Invalid credentials"}
    
    def verify_password(self, stored_password, provided_password, salt):
        # Hash de la contraseña proporcionada con el mismo salt
        hashed_provided_password = self.hash_password(provided_password, salt)
        # Compara el hash almacenado con el hash proporcionado
        return stored_password == hashed_provided_password

    def hash_password(self, password: str, salt: str) -> str:
        # Combina la contraseña con el salt y hashea usando SHA-256
        password_salt = password + salt
        hashed_password = hashlib.sha256(password_salt.encode()).hexdigest()
        return hashed_password
    
    
login_use_case = LoginUseCase()

import hashlib
import os
from domain.repositories.mongo_repository import MongoRepository

class RegistrationUseCase:
    def __init__(self):
        self.repo = MongoRepository()

    def execute(self, username, password):
        # Verificar si el usuario ya existe
        existing_user = self.get_user_from_db(username)
        if existing_user:
            return {"status": "error", "message": "User already exists"}

        # Generar un salt y hashear la contraseña
        salt = os.urandom(16).hex()
        hashed_password = self.hash_password(password, salt)

        # Insertar el nuevo usuario en la base de datos
        document = {"username": username, "password": hashed_password, "salt": salt}
        self.repo.insert_one("users", document)
        
        return {"status": "success", "message": "User registered successfully"}

    def get_user_from_db(self, username):
        collection_name = "users"
        query = {"username": username}
        return self.repo.find_one(collection_name, query)

    def hash_password(self, password: str, salt: str) -> str:
        password_salt = password + salt
        return hashlib.sha256(password_salt.encode()).hexdigest()

registration_use_case = RegistrationUseCase()

from domain.repositories.mongo_repository import MongoRepository

class RegistrationUseCase:
    def __init__(self):
        self.repo = MongoRepository()

    def execute(self, username, email, password):
        try:
            # Verificar si el usuario ya existe
            existing_user = self.get_user_from_db(username)
            if existing_user:
                return {"status": "error", "message": "User already exists"}

            # Insertar el nuevo usuario en la base de datos
            document = {"username": username, "email": email, "password": password}
            self.repo.insert_one("users", document)

            return {"status": "success", "message": "User registered successfully"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_user_from_db(self, username):
        try:
            collection_name = "users"
            query = {"username": username}
            return self.repo.find_one(collection_name, query)
        except Exception as e:
            return {"status": "error", "message": str(e)}




registration_use_case = RegistrationUseCase()

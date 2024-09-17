from domain.repositories.mongo_repository import MongoRepository

class LoginUseCase:
    def __init__(self):
        self.repo = MongoRepository()

    def get_user_from_db(self, username):
        collection_name = "users"
        query = {"username": username}
        user = self.repo.find_one(collection_name, query)
        print(f"User fetched from DB: {user}")  # Debugging line
        return user
    
    def execute(self, username, password):
        user = self.get_user_from_db(username)
        
        if user:
            print(f"User found: {user['username']}")  # Debugging line
            if self.verify_password(password, user["password"]):
                return {"status": "success", "message": "Login successful"}
            else:
                return {"status": "error", "message": "Invalid credentials"}
        else:
            return {"status": "error", "message": "User not found"}
    
    def verify_password(self, provided_password, stored_password):
        print(f"Stored password: {stored_password}")  # Debugging line
        print(f"Provided password: {provided_password}")  # Debugging line
        return stored_password == provided_password

login_use_case = LoginUseCase()

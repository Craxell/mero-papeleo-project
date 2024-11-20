from locust import HttpUser, task, between
import json


import random
import string 


class ApiLoadTest(HttpUser):
    wait_time = between(1, 3)  # Shorter wait times for API testing
    token = None  # Store authentication token

    def on_start(self):
        """Login and store authentication token"""
        login_payload = {
            "username": "juancho12",
            "password": "123456"
        }
        headers = {
            "Content-Type": "application/json"
        }
        
        # Perform login and store token
        with self.client.post(
            "/login",
            json=login_payload,
            headers=headers,
            catch_response=True
        ) as response:
            try:
                if response.status_code == 200:
                    # Assuming token is returned in response
                    self.token = response.json().get('token', '')
                    response.success()
                else:
                    response.failure(f"Login failed with status code: {response.status_code}")
            except json.JSONDecodeError:
                response.failure("Invalid JSON response")
    
    def get_auth_headers(self):
        """Return headers with authentication token"""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}"
        }
    
    @task(2)
    def register_user(self):
        username_lenght = random.randint(1,12)
        username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=username_lenght))
        email = f"{username}@locust.lc"
        
        payload = {
            "username": username,
            "email": email,
            "password": "password123"
        }
        with self.client.post(
            "/register",
            json=payload,
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 201:
                response.success()
            else:
                response.failure(f"Registration failed: {response.status_code}")
    
    @task(3)
    def login_user(self):
        payload = {
            "username": "Carlos",
            "password": "12345"
        }
        with self.client.post(
            "/login",
            json=payload,
            headers={"Content-Type": "application/json"},
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Login failed: {response.status_code}")

    @task(1)
    def get_roles(self):
        with self.client.get(
            "/roles",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Get roles failed: {response.status_code}")

    @task(1)
    def get_document(self):
        with self.client.get(
            "/get-document?document_id=068befbc-cf61-4ed0-ae50-46f4b2e52dd7",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Get document failed: {response.status_code}")

    @task(1)
    def get_users(self):
        with self.client.get(
            "/users",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Get users failed: {response.status_code}")
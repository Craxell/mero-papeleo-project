import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
import uvicorn

# Importa tus routers o endpoints aquí
from application.registration_use_case import registration_use_case
from application.login_use_case import login_use_case

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O especifica los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],  # O especifica los métodos permitidos, como ["GET", "POST"]
    allow_headers=["*"],  # O especifica los encabezados permitidos
)

# Ejemplo de una ruta simple
@app.get("/")
def read_root():
    return {"Hello": "World"}

# Definición de rutas adicionales
class UserRegistration(BaseModel):
    username: str
    email: str
    password: str

@app.post("/register")
def register_user(user: UserRegistration):
    result = registration_use_case.execute(user.username, user.email, user.password)
    if result["status"] == "success":
        return {"status": "success", "message": "Registration successful"}
    else:
        raise HTTPException(status_code=400, detail=result["message"])

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(request: LoginRequest):
    result = login_use_case.execute(request.username, request.password)
    if result['status'] == 'success':
        return {"status": "success", "message": "Login exitoso"}
    else:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

# Ejecutar uvicorn cuando se ejecuta el archivo directamente
if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.APP_HOST, port=settings.APP_PORT, reload=True)

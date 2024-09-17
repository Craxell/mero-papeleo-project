from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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

# Configura otros aspectos de la aplicación aquí, como middleware, eventos, etc.

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

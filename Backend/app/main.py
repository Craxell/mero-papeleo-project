from fastapi import FastAPI
from app.config import settings

# Importa tus routers o endpoints aquí
from application.use_cases import some_use_case

app = FastAPI()

# Incluye tus routers aquí
# app.include_router(some_router)

# Ejemplo de una ruta simple
@app.get("/")
def read_root():
    return {"Hello": "World"}

# Configura otros aspectos de la aplicación aquí, como middleware, eventos, etc.

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.APP_HOST, port=settings.APP_PORT, reload=True)
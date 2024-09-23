# Mero Papeleo RAG Project

## Descripción

Mero Papeleo es un proyecto en desarrollo que tiene como objetivo proporcionar una solución para [breve descripción del propósito del proyecto]. Actualmente, se encuentra en fase de pruebas para verificar su funcionamiento.

## Características

- [Descripción de la característica 1]
- [Descripción de la característica 2]
- [Descripción de la característica 3]

## Instalación

Para instalar y ejecutar el proyecto localmente, sigue estos pasos:

1. **Clona el repositorio**:
   
   `git clone https://github.com/Craxell/mero-papeleo-project.git`

Configura el entorno de desarrollo:

2. **Backend**:

Instala Conda (si aún no está instalado). Puedes descargarlo desde aquí.
Crea y activa el entorno Conda para el backend:

1. `conda create -n meroPapeleo python` <br>
2. `conda activate meroPapeleo` <br>
3. `pip install poetry` <br>
   
### Inicialización del proyecto <br>
1. `poetry install` <br>
2. `cd mero-papeleo-frontend && npm i`<br>
   
### Ejecución del proyecto
1. `cd .. && cd Backend/app && python .\main.py`
2. `cd ../../mero-papeleo-frontend && npm run dev`

## **README.md**<br>
Este archivo `README.md` proporciona una guía completa y detallada para clonar el repositorio, configurar el entorno de desarrollo, instalar las dependencias, y ejecutar tanto el frontend como el backend del proyecto. Guárdalo en la raíz de tu repositorio para que los colaboradores y usuarios puedan seguir estos pasos fácilmente.


## Contribuyentes

- Juan Eduardo Jaramillo [@JuanJaramillo12004](https://github.com/JuanJaramillo12004)
- Nicolás González [@FRANGONICOLAS](https://github.com/FRANGONICOLAS)
- Carlos Altamirano [@Craxell](https://github.com/Craxell)
- Sebastian Balanta [@PostboxRetinal](https://github.com/PostboxRetinal)


## Notas

Dependencias por instalar (TO DO):

**fastapi[all]**: Incluye FastAPI y sus dependencias recomendadas.<br>
**pymongo**: Cliente para interactuar con MongoDB.<br>
**python-jose**: Para manejar JSON Web Tokens (JWT).<br>
**passlib**: Para hashing de contraseñas.<br>

## Errores conocidos:

Existen errores en la ejecución de main. Se planea solucionar estos problemas en una versión futura.
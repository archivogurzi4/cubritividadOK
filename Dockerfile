# Etapa 1: Build del Frontend (Node.js)
FROM node:18 AS frontend-build
WORKDIR /app/frontend

# Copiar configuración e instalar dependencias de Node
COPY frontend/package*.json ./
RUN npm install

# Copiar código fuente y compilar (Vite)
COPY frontend/ ./
RUN npm run build

# Etapa 2: Entorno del Servidor (Python + Ghostscript)
FROM python:3.10-slim
WORKDIR /app

# Instalar dependencias vitales del sistema (Ghostscript)
RUN apt-get update && apt-get install -y \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el backend
COPY backend/ ./backend/

# Copiar los archivos estáticos compilados desde la Etapa 1
COPY --from=frontend-build /app/frontend/dist ./frontend/dist/

# Exponer el puerto estándar de nuestra aplicación
EXPOSE 8000

# Comando para iniciar nuestro servidor maestro (FastAPI)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

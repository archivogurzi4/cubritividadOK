# RIP Latino: Precisión Pro

**RIP Latino** es una herramienta profesional de análisis de cubritividad de tinta para flujos de trabajo de pre-prensa. A diferencia de soluciones básicas, esta aplicación utiliza **Ghostscript (`tiffsep`)** en el backend para extraer e interpretar con total precisión las separaciones (planchas) tanto de los canales CMYK como de **tintas planas (Spots/Pantones)**, brindando un porcentaje real de cobertura sobre el papel.

## Características Principales

-   🚀 Analizador basado en el estándar de la industria (Ghostscript RIP).
-   🎨 Soporte para múltiples tintas planas (Spots) sin convertirlas destructivamente a CMYK.
-   ⚡ Interfaz web moderna, amigable y veloz construida con React, Vite y CSS nativo premium.
-   📊 Backend en FastAPI preparado para procesar PDFs de pre-prensa pesados y reportar la actividad asíncrona.
-   🌐 Diseñado para fácil despliegue en redes locales o servidores dedicados.

## Requisitos Previos

Para desplegar o ejecutar la aplicación localmente, necesitas instalar:

1.  **Python 3.9 o superior** (Para el motor de análisis y servidor).
2.  **Node.js 18 o superior** (Para compilar la interfaz de usuario).
3.  **Ghostscript** (Requisito fundamental del procesamiento):
    -   *Windows:* Descarga e instala Ghostscript. El sistema está preparado para buscar automáticamente `gswin64c.exe` o `gswin32c.exe`. Se recomienda agregarlo a las variables de entorno (`PATH`).
    -   *Linux/macOS:* Instálalo desde el gestor de paquetes (`sudo apt install ghostscript` / `brew install ghostscript`).

## Entorno Local y Despliegue

La plataforma está diseñada para que el propio FastAPI aloje el Frontend ya compilado por Vite.

### 1. Compilar el Frontend

Abre una consola y sitúate en la raíz del proyecto. Ejecuta:

```bash
cd frontend
npm install
npm run build
cd ..
```

Esto procesa el código de React y deposita los recursos productivos en `frontend/dist`.

### 2. Configurar el Backend

Crear un entorno virtual de Python previene conflictos entre paquetes. Estando en la raíz del proyecto:

```bash
# 1. Crear entorno:
python -m venv venv

# 2. Activar el entorno:
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
# source venv/bin/activate

# 3. Instalar librerías:
pip install -r requirements.txt
```

### 3. Ejecutar el Servidor

Una vez instalado todo, arranca el servidor maestro:

```bash
python backend/main.py
```

El log de Uvicorn te informará que la app está activa. Visita:
👉 **http://localhost:8000**

Si deseas utilizarlo desde otra computadora en tu misma red local, ingresa a `http://[Tu-IP-Local]:8000` (El servidor escucha nativamente en `0.0.0.0`).

## Funcionamiento Técnico

El archivo `pdf_analyzer.py` realiza la magia: 
1. Crea un entorno seguro temporal.
2. Comanda a Ghostscript utilizando el dispositivo `tiffsep`.
3. Escanea y lee nivel de grises sobre los separables .TIF exportados recurriendo a la librería `numpy` para sacar un promedio matemático exacto de píxeles activos (tinta) versus inactivos (papel).
4. Limpia el área al finalizar, asegurando estabilidad a largo plazo.

## Contribución

Siente la libertad de clonar el proyecto, hacer un *fork*, e implementar sugerencias a través de *Pull Requests*.

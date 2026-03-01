# Usa una imagen ligera pero completa de Python 3.11
FROM python:3.11-slim

# Evita que Python genere archivos .pyc y permite logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalamos dependencias del sistema necesarias para PyTorch y C++
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiamos solo los requisitos primero para aprovechar la caché de Docker
COPY requirements.txt .

# Instalamos dependencias (Aquí PyTorch ya no dará error de disco)
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código del cerebro científico
COPY . .

# Exponemos el puerto que usa Cloud Run
EXPOSE 8080

# Comando de arranque usando functions-framework para mantener compatibilidad
CMD ["functions-framework", "--target", "audit_ricci", "--port", "8080"]

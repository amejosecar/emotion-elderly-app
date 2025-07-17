#!/usr/bin/env python3
"""
Script para crear la estructura de carpetas y archivos base.
Cada archivo solo contendrá un comentario con su ruta absoluta
y su nombre.
"""

import os
from pathlib import Path

def create_structure(base_path: Path):
    # Lista de ficheros a crear (rutas relativas a base_path)
    files = [
        # Alembic
        "backend/alembic/env.py",
        "backend/alembic/versions/.gitkeep",

        # API routers
        "backend/app/api/routers/auth.py",
        "backend/app/api/routers/audios.py",
        "backend/app/api/routers/analyze.py",
        "backend/app/api/routers/alerts.py",
        "backend/app/api/dependencies.py",
        "backend/app/api/errors.py",

        # Core
        "backend/app/core/config.py",
        "backend/app/core/security.py",
        "backend/app/core/logger.py",

        # DB
        "backend/app/db/base.py",
        "backend/app/db/session.py",

        # Models
        "backend/app/models/user.py",
        "backend/app/models/role.py",
        "backend/app/models/audio.py",
        "backend/app/models/emotion.py",
        "backend/app/models/alert.py",

        # Schemas
        "backend/app/schemas/auth.py",
        "backend/app/schemas/user.py",
        "backend/app/schemas/audio.py",
        "backend/app/schemas/emotion.py",
        "backend/app/schemas/alert.py",

        # Services
        "backend/app/services/audio_service.py",
        "backend/app/services/emotion_recognition.py",

        # Utils
        "backend/app/utils/file.py",
        "backend/app/utils/date_utils.py",

        # Main
        "backend/app/main.py",

        # Tests
        "tests/unit/.gitkeep",
        "tests/integration/.gitkeep",
    ]

    for rel_path in files:
        file_path = base_path / rel_path
        dir_path = file_path.parent
        # Crear carpetas si no existen
        dir_path.mkdir(parents=True, exist_ok=True)

        # Escribir archivo con comentario
        content = (
            f"# {file_path.resolve()}\n"
            f"# {file_path.name}\n"
        )
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Creado: {file_path}")

if __name__ == "__main__":
    # Ajusta esta ruta si es necesario
    # Debe apuntar a C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app
    base = Path(__file__).resolve().parent.parent
    create_structure(base)

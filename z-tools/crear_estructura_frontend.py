#!/usr/bin/env python3
"""
Script para crear la estructura de carpetas y archivos del frontend.
Cada archivo contendrá un comentario con su ruta absoluta y su nombre.
"""

import os
from pathlib import Path

def create_frontend_structure(base_path: Path):
    """
    Crea la estructura de directorios y archivos para frontend.
    base_path: ruta absoluta hasta emotion-elderly-app
    """
    frontend = base_path / "frontend"
    files = [
        "public/index.html",
        "src/api/axios.ts",
        "src/assets/.gitkeep",
        "src/components/common/.gitkeep",
        "src/components/layout/.gitkeep",
        "src/contexts/.gitkeep",
        "src/hooks/.gitkeep",
        "src/pages/Home.tsx",
        "src/pages/Auth.tsx",
        "src/pages/Dashboard.tsx",
        "src/pages/AudioHistory.tsx",
        "src/pages/Alerts.tsx",
        "src/routes/index.tsx",
        "src/styles/theme.ts",
        "src/utils/formatDate.ts",
        "src/App.tsx",
        "src/index.tsx",
        ".env.example",
        "tsconfig.json",
        "package.json",
        "README.md",
    ]

    for rel in files:
        file_path = frontend / rel
        dir_path = file_path.parent
        # Crear directorios necesarios
        dir_path.mkdir(parents=True, exist_ok=True)

        # Contenido del archivo: ruta absoluta y nombre de archivo
        content = f"# {file_path.resolve()}\n# {file_path.name}\n"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Creado: {file_path}")

if __name__ == "__main__":
    # Ajusta esta ruta si ejecutas el script desde otro directorio
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent  # ../emotion-elderly-app
    create_frontend_structure(project_root)

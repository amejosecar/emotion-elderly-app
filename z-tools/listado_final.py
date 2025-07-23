import os
from pathlib import Path

# Carpeta raíz
root_dir = Path(r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app")

# Rutas a excluir (normalizadas)
excluded_dirs = [
    ".git",
    ".venv",
    "backend/alembic/__pycache__",
    "backend/alembic/versions/__pycache__",
    "backend/app/__pycache__",
    "backend/app/api/__pycache__",
    "backend/app/api/routers/__pycache__",
    "backend/app/core/__pycache__",
    "backend/app/db/__pycache__",
    "backend/app/models/__pycache__",
    "backend/app/schemas/__pycache__",
    "backend/app/services/__pycache__",
    "backend/sonido",
    "frontend/node_modules",
    "sonido",
    "sonido/audios",
    "z-tools"
]
excluded_paths = [root_dir / Path(p) for p in excluded_dirs]

# Agrupación de archivos por carpeta
grouped_files = {}

for dirpath, _, filenames in os.walk(root_dir):
    current_folder = Path(dirpath)
    # Verificar si la carpeta está excluida o dentro de una excluida
    if any(current_folder == ex or current_folder.is_relative_to(ex) for ex in excluded_paths):
        continue
    if filenames:
        grouped_files[current_folder] = [current_folder / f for f in filenames]

# Escritura del archivo de salida
output_file = root_dir / "z-tools" / "listado_final.txt"
if output_file.exists():
    output_file.unlink()
with output_file.open("w", encoding="utf-8") as f:
    for folder, files in grouped_files.items():
        #f.write(f"Folder: {folder}\n")
        for file_path in files:
            f.write(f"r+{file_path}*\n")
        f.write("\n")

print(f"✅ Archivo generado: {output_file}")

import os

# Ruta base ya existente
base_path = r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app"

# Estructura de carpetas y archivos
estructura = {
    "backend": [
        "app/",
        "alembic/",
        "requirements.txt"
    ],
    "frontend": [],
    "docs": [],
    "tests": [],
    "README.md": None
}

def crear_estructura(base, estructura):
    for carpeta, contenido in estructura.items():
        carpeta_path = os.path.join(base, carpeta)
        if contenido is None:
            # Es un archivo en la raíz
            archivo_path = os.path.join(base, carpeta)
            with open(archivo_path, 'w', encoding='utf-8') as f:
                f.write("# Proyecto Emotion Elderly App\n")
        else:
            os.makedirs(carpeta_path, exist_ok=True)
            for item in contenido:
                item_path = os.path.join(carpeta_path, item)
                if item.endswith('/'):
                    os.makedirs(item_path, exist_ok=True)
                else:
                    with open(item_path, 'w', encoding='utf-8') as f:
                        f.write("# Requisitos para el backend\n")

# Ejecutar la función
crear_estructura(base_path, estructura)

print("Estructura creada correctamente.")

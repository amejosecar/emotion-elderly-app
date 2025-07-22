#!/usr/bin/env python3
"""
Script que recorre recursivamente las carpetas raíz y combina
el contenido de todos los archivos en un único fichero de salida,
excluyendo la carpeta node_modules.
"""

import time
from pathlib import Path

def main():
    start = time.time()
    # Directorio del script y rutas raíz
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent

    # Carpeta a excluir
    excluded_dir = project_root / "frontend" / "node_modules"

    roots = [
        project_root / "backend",
        project_root / "frontend",
        # project_root / "docs",
        # project_root / "test",
    ]

    # Archivo de salida
    output_file = script_dir / "01-mi_app.txt"
    if output_file.exists():
        output_file.unlink()

    processed = set()
    total_files = 0

    with output_file.open("w", encoding="utf-8") as out:
        for root in roots:
            if not root.exists():
                continue
            for file in root.rglob("*"):
                if not file.is_file():
                    continue
                try:
                    resolved = file.resolve()
                except Exception:
                    continue
                # Excluir archivos dentro de node_modules
                if excluded_dir in resolved.parents:
                    continue
                # Evita duplicados y el propio archivo de salida
                if resolved == output_file.resolve() or resolved in processed:
                    continue
                processed.add(resolved)
                total_files += 1

                # Encabezado con ruta y nombre
                out.write(f"# {resolved}\n")
                out.write(f"# {file.name}\n")

                # Lectura segura del contenido
                try:
                    text = resolved.read_text(encoding="utf-8")
                except Exception:
                    try:
                        text = resolved.read_text(encoding="latin-1")
                    except Exception:
                        text = ""
                out.write(text + "\n\n")

    elapsed = time.time() - start
    print(f"[✔] Combinados {total_files} archivos en: {output_file}")
    print(f"[⏱] Tiempo empleado: {elapsed:.2f}s")

if __name__ == "__main__":
    main()

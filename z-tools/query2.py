import sqlite3
import os

# Ruta a la base de datos
db_path = r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app.db"

# Nombre del archivo de salida (basado en el nombre de la BD)
output_file = os.path.splitext(os.path.basename(db_path))[0] + ".txt"

try:
    # Conexión a la base de datos
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Obtener todas las tablas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]

    with open(output_file, "w", encoding="utf-8") as f:
        for table in tables:
            f.write(f"\n--- Tabla: {table} ---\n")

            try:
                cursor.execute(f"SELECT * FROM {table};")
                rows = cursor.fetchall()
                columns = [description[0] for description in cursor.description]

                # Escribir encabezado
                f.write(" | ".join(columns) + "\n")

                # Escribir filas
                for row in rows:
                    f.write(" | ".join(str(value) for value in row) + "\n")

            except sqlite3.Error as e:
                f.write(f"Error al consultar la tabla {table}: {e}\n")

    print(f"✅ Datos exportados a: {output_file}")

except sqlite3.Error as e:
    print(f"❌ Error al conectar con la base de datos: {e}")

finally:
    if conn:
        conn.close()

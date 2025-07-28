import sqlite3

# Ruta a la base de datos
db_path = r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app.db"

# Nombre de la tabla que quieres consultar
table_name = "audios"  # Reemplaza esto con el nombre real
#table_name = "emotions"  # Reemplaza esto con el nombre real

# Conexión a la base de datos
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Consulta SELECT
query = f"SELECT * FROM {table_name};"

try:
    cursor.execute(query)
    rows = cursor.fetchall()

    # Mostrar resultados
    for row in rows:
        print(row)

except sqlite3.Error as e:
    print(f"Error al ejecutar la consulta: {e}")

finally:
    # Cerrar conexión
    conn.close()

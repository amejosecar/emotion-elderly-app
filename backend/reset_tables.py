from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import Session

# Ruta a la base de datos SQLite
DATABASE_URL = "sqlite:///app.db"

# Crear el motor y conectar
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Reflejar las tablas existentes
metadata.reflect(bind=engine)

# Acceder a las tablas
audios_table = Table("audios", metadata, autoload_with=engine)
emotions_table = Table("emotions", metadata, autoload_with=engine)
alerts_table = Table("alerts", metadata, autoload_with=engine)

# Borrar contenido de las tablas
with Session(engine) as session:
    session.execute(audios_table.delete())
    session.execute(emotions_table.delete())
    session.execute(alerts_table.delete())
    session.commit()

print("✅ Tablas 'audios' y 'emotions' vaciadas correctamente.")

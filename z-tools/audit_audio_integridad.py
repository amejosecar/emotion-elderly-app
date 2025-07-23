# z-tools/audit_audio_integridad.py

import sys
import os
from pathlib import Path
from datetime import datetime
from sqlalchemy.orm import Session
from dotenv import load_dotenv  # ✅ Corrección aquí

# 🔧 Configurar rutas
CURRENT_FILE = Path(__file__).resolve()
ROOT_DIR = CURRENT_FILE.parents[1]  # emotion-elderly-app
BACKEND_DIR = ROOT_DIR / "backend"
LOG_PATH = ROOT_DIR / "z-tools" / "audit_audio_integridad_log.txt"

# 🧪 Añadir backend al PYTHONPATH
sys.path.insert(0, str(BACKEND_DIR))

# 🔐 Cargar variables de entorno desde backend/.env
load_dotenv(dotenv_path=BACKEND_DIR / ".env")

# ✅ Importar modelos y sesión de la base de datos
try:
    from app.db.session import SessionLocal
    from app.models.audio import Audio
    from app.models.user import User
    from app.models.emotion import Emotion
    from app.models.alert import Alert
    from app.models.role    import Role
except ModuleNotFoundError as e:
    print("❌ Error: No se pudo importar el módulo 'app'. Verifica que la estructura del proyecto sea correcta.")
    print(f"Detalles: {e}")
    sys.exit(1)

def auditar_y_registrar():
    db: Session = SessionLocal()
    audios = db.query(Audio).all()
    huérfanos = []

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log = [f"\n🕒 Auditoría ejecutada el {timestamp}\n"]

    for audio in audios:
        ruta = Path(audio.file_path).expanduser().resolve()
        if ruta.exists():
            estado = f"✅ {audio.file_path} existe ({ruta.stat().st_size} bytes)"
        else:
            estado = f"❌ {audio.file_path} NO existe"
            huérfanos.append(audio)
        log.append(estado)

    log.append(f"\n🧹 Audios huérfanos detectados: {len(huérfanos)}")

    # 📝 Guardar log en archivo
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write("\n".join(log) + "\n")

    print("\n".join(log))

    # 🗑️ Preguntar si se eliminan los huérfanos
    if huérfanos:
        confirm = input("¿Eliminar registros huérfanos de la BD? (s/n): ").strip().lower()
        if confirm == "s":
            for audio in huérfanos:
                db.delete(audio)
            db.commit()
            print("✅ Registros eliminados.")
        else:
            print("⏹ Operación cancelada.")

    db.close()

if __name__ == "__main__":
    auditar_y_registrar()

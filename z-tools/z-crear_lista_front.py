#
import os
from datetime import datetime

# create_structure.py

# Lista de rutas de los archivos a incluir
paths_to_process = [
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\.gitignore",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\package-lock.json",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\README.md",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\.env",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\.env.example",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\alembic.ini",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\alembic\env.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\alembic\README",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\alembic\script.py.mako",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\alembic\versions\0df35657cc1b_initial_schema.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\alembic\versions\307613368dfe_initial_schema.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\database.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\main.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\models.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\__init__.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\dependencies.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\errors.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\routers\alerts.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\routers\analyze.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\routers\audios.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\routers\auth.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\api\routers\users.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\core\config.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\core\logger.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\core\metrics.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\core\security.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\core\__init__.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\db\base.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\db\session.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\models\__init__.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\models\alert.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\models\audio.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\models\emotion.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\models\role.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\models\user.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\schemas\alert.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\schemas\audio.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\schemas\auth.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\schemas\emotion.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\schemas\user.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\services\audio_service.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\services\emotion_recognition.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\templates\index.html",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\templates\static\00.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\utils\date_utils.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\app\utils\file.py",
# r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\test\test_auth.py",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\.env",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\.env.example",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\.gitignore",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\eslint.config.js",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\index.html",
#r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\package-lock.json",
#r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\package.json",
#r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\README.md",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\tsconfig.app.json",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\tsconfig.json",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\tsconfig.node.json",
#r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\vite.config.ts",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\public\index.html",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\App.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\index.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\main.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\vite-env.d.ts",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\api\axios.ts",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\assets\.gitkeep",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\components\EmotionChart.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\components\PrivateRoute.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\components\common\.gitkeep",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\components\layout\.gitkeep",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\components\layout\Footer.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\components\layout\Layout.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\components\layout\Navbar.css",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\components\layout\Navbar.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\components\ErrorBoundary.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\contexts\.gitkeep",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\contexts\AuthContext.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\hooks\.gitkeep",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\Alerts.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\Analyze.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\AudioHistory.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\Auth.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\Dashboard.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\Home.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\Login.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\UploadAudio.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\UploadMultipleAudios.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\routes\index.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\routes\ProtectedRoute.tsx",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\styles\spinner.css",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\styles\Form.css",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\styles\theme.ts",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\styles\progress.css",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\utils\formatDate.ts",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\tests\integration\.gitkeep",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\tests\unit\.gitkeep",
r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\types\index.ts",
]

def write_files_to_txt(file_paths, output_file):
    """
    Escribe la fecha/hora de creación en la primera línea
    y luego vuelca cada archivo con separadores.
    """
    # 1) Cabecera con fecha y hora actuales
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(output_file, "w", encoding="utf8") as outf:
        outf.write(f"Creado el {now_str}\n\n")

        # 2) Contenido de cada archivo
        for file_path in file_paths:
            outf.write("-" * 40 + "\n")
            outf.write(f"# {file_path}\n")
            try:
                with open(file_path, "r", encoding="utf8") as f:
                    outf.write(f.read())
            except Exception as e:
                outf.write(f"# Error al leer este archivo: {e}\n")
            outf.write("\n")

    print(f"Se han copiado {len(file_paths)} archivos a '{output_file}'.")

if __name__ == "__main__":
    # 1) Eliminar versión previa si existe
    target = r"C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\z-tools\z-app_front.txt"
    if os.path.exists(target):
        print("Archivo existente encontrado, eliminando...")
        try:
            os.remove(target)
            print("Archivo eliminado.")
        except Exception as e:
            print(f"No se pudo eliminar el archivo: {e}")
    else:
        print("No se encontró archivo anterior, continuando.")

    # 2) Generar nuevo TXT
    output_file = "z-app_front.txt"
    write_files_to_txt(paths_to_process, output_file)

    # 3) Mensaje final
    print("Código ejecutado con éxito.")

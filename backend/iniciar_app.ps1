# Ruta base del proyecto
$basePath = "C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app"

# Cambiar al directorio principal
Set-Location -Path "$basePath"

# Limpiar la consola
Clear-Host

# Activar el entorno virtual
& "$basePath\.venv\Scripts\Activate.ps1"

# Cambiar al directorio backend
Set-Location -Path "$basePath\backend"

# Ejecutar el servidor Uvicorn
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# (Opcional) Abrir el navegador automáticamente
#Start-Process "http://127.0.0.1:8000"


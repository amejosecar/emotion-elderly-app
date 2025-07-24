# Ruta base del proyecto
$basePath = "C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app"

# Cambiar al directorio principal
Set-Location -Path "$basePath"

# Limpiar la consola
Clear-Host

# Activar el entorno virtual
& "$basePath\.venv\Scripts\Activate.ps1"

# Cambiar al directorio frontend
Set-Location -Path "$basePath\frontend"

# Ejecutar el servidor Vite
npm run dev -- --force

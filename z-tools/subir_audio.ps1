# subir_audio.ps1

# Ruta del archivo de audio
$filePath = "C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\sonido\Free_Test_Data_2MB_WAV.wav"

# Token JWT (reemplaza por el tuyo real)
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzUyODQ1MzQ1fQ.p9hINPdA9CZQfTaFyzZL5Vjnky-AZZd2GsdOMO_AOdo"

# Crear contenido multipart
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$fileName = [System.IO.Path]::GetFileName($filePath)

$bodyLines = @(
  "--$boundary",
  "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
  "Content-Type: audio/wav$LF",
  [System.Text.Encoding]::UTF8.GetString($fileBytes),
  "--$boundary--$LF"
)

$body = [System.Text.Encoding]::UTF8.GetBytes(($bodyLines -join $LF))

# Crear la petición
$headers = @{
  Authorization = "Bearer $token"
  "Content-Type" = "multipart/form-data; boundary=$boundary"
}

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/audios/" `
  -Method Post `
  -Headers $headers `
  -Body $body

$response

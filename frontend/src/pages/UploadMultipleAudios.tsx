// frontend/src/pages/UploadMultipleAudios.tsx
import React, { useState } from "react";
import axios from "../api/axios";

const MAX_FILES = 20;
const MAX_SIZE_MB = 10;

const UploadMultipleAudios: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<
    { filename: string; content_type: string; size: number }[]
  >([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(validateFile);

    if (validFiles.length > MAX_FILES) {
      setMessage(`⚠️ Máximo ${MAX_FILES} archivos permitidos.`);
      return;
    }

    setFiles(validFiles);
    setMessage("");
    setResults([]);
  };

  const validateFile = (file: File): boolean => {
    const isAudio = file.type.startsWith("audio/");
    const isSizeValid = file.size / (1024 * 1024) <= MAX_SIZE_MB;
    return isAudio && isSizeValid;
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setMessage("⚠️ No hay archivos para subir.");
      return;
    }

    setUploading(true);
    setMessage("");
    setResults([]);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file); // 👈 campo esperado por FastAPI
      });

      const response = await axios.post("/audios/bulk", formData);

      setMessage("✅ Todos los archivos se subieron correctamente.");
      setResults(
        response.data.map((audio: any) => ({
          filename: audio.file_path.split("/").pop(),
          content_type: "audio",
          size: 0, // opcional si quieres mostrar algo
        }))
      );
      setFiles([]);
    } catch (error: any) {
      console.error("Error al subir archivos:", error);
      setMessage("❌ Error al subir los archivos.");
    } finally {
      setUploading(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setMessage("");
    setResults([]);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🎙️ Subir Múltiples Audios</h2>

      <input
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {files.length > 0 && (
        <ul>
          {files.map((file, idx) => (
            <li key={idx}>
              {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={uploadFiles} disabled={uploading}>
          {uploading ? "Subiendo..." : "Subir"}
        </button>
        <button
          onClick={clearFiles}
          disabled={uploading}
          style={{ marginLeft: "1rem" }}
        >
          Limpiar
        </button>
      </div>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

      {results.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h3>📄 Resultados del servidor:</h3>
          <ul>
            {results.map((file, idx) => (
              <li key={idx}>
                <strong>{file.filename}</strong> – {file.content_type},{" "}
                {(file.size / 1024).toFixed(2)} KB
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadMultipleAudios;

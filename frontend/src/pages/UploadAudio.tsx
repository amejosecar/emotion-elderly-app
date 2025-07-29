//src/pages/UploadAudio.tsx
// frontend/src/pages/UploadAudio.tsx
import React, { useState, useRef } from "react";
import api from "../api/axios";

const MAX_SIZE_MB = 10;

const UploadAudio: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("audio/")) {
      return "❌ El archivo debe ser de tipo audio.";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `❌ El archivo supera el límite de ${MAX_SIZE_MB} MB.`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!file) {
      setMessage("Selecciona un archivo primero");
      return;
    }

    const error = validateFile(file);
    if (error) {
      setMessage(error);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/audios/", formData);
      setMessage(`✅ Audio subido con ID ${res.data.id}`);
      // Limpiar estado y campo de input para evitar duplicados
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "❌ Error al subir");
    }
  };

  return (
    <main>
      <h1>Subir Audio</h1>

      <form onSubmit={handleSubmit}>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.currentTarget.files?.[0] || null)}
          required
        />
        <button
          type="submit"
          disabled={!file || (file && validateFile(file) !== null)}
        >
          Enviar
        </button>
      </form>

      {message && (
        <p style={{ color: message.startsWith("❌") ? "red" : "green" }}>
          {message}
        </p>
      )}
    </main>
  );
};

export default UploadAudio;

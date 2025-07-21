//src/pages/UploadAudio.tsx

import React, { useState } from 'react';
import api from '../api/axios';

const UploadAudio: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!file) {
      setMessage('Selecciona un archivo primero');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/audios/', formData);
      setMessage(`✅ Audio subido con ID ${res.data.id}`);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || '❌ Error al subir');
    }
  };

  return (
    <main>
      <h1>Subir Audio</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="audio/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
          required
        />
        <button type="submit">Enviar</button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
};

export default UploadAudio;

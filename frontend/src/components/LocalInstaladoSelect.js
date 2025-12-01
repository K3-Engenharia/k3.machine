import React, { useEffect, useState } from 'react';
import { TextField, MenuItem, IconButton, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import API_URL from '../services/apiConfig';

export default function LocalInstaladoSelect({ value, onChange, required, empresaId }) {
  const [locais, setLocais] = useState([]);
  useEffect(() => {
    if (!empresaId) {
      setLocais([]);
      return;
    }
    async function fetchLocais() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/locais-instalados?empresa_id=${empresaId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLocais(data);
        }
      } catch {}
    }
    fetchLocais();
  }, [empresaId]);

  const handleAddLocal = async () => {
    if (!novoLocal.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/locais-instalados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nome: novoLocal })
      });
      if (res.ok) {
        const novo = await res.json();
        setLocais([...locais, novo]);
        onChange({ target: { name: 'local_instalado', value: novo.nome } });
        setNovoLocal('');
        setShowNovo(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TextField
        select
        label="Local Instalado"
        name="local_instalado"
        value={value}
        onChange={onChange}
        fullWidth
        required={required}
      >
        {locais.length > 0 ? (
          locais.map(l => (
            <MenuItem key={l.id} value={l.nome}>{l.nome}</MenuItem>
          ))
        ) : (
          <MenuItem value="" disabled>Nenhum local cadastrado</MenuItem>
        )}
      </TextField>
      {/* Botão de adicionar novo local removido */}
    </>
  );
}

import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../components/BackToDashboardButton';
import API_URL from '../services/apiConfig';

export default function EmpresaForm() {
  const [form, setForm] = useState({ nome: '', cidade: '', estado: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!form.nome) {
      setError('O nome da empresa é obrigatório');
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/empresas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Erro ao cadastrar empresa');
      } else {
        setSuccess('Empresa cadastrada com sucesso!');
        setTimeout(() => navigate('/dashboard'), 1200);
      }
    } catch {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper sx={{ p: 4, minWidth: 400 }}>
        <BackToDashboardButton />
        <Typography variant="h5" mb={2}>Cadastrar Empresa</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Nome da empresa" name="nome" value={form.nome} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Cidade" name="cidade" value={form.cidade} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Estado" name="estado" value={form.estado} onChange={handleChange} fullWidth margin="normal" />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          {success && <Typography color="success.main" variant="body2">{success}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Salvando...' : 'Cadastrar'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, MenuItem, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_URL from '../services/apiConfig';

export default function UsuarioCreate() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'tecnico',
    empresas: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchEmpresas() {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/empresas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEmpresas(await res.json());
      }
    }
    fetchEmpresas();
  }, []);


  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEmpresasChange = e => {
    const { value } = e.target;
    setForm({ ...form, empresas: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.username || !form.email || !form.password || !form.empresas.length) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/admin/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setSuccess('Usuário cadastrado com sucesso!');
      setForm({ name: '', username: '', email: '', password: '', role: 'tecnico', empresas: [] });
    } else {
      const data = await res.json();
      setError(data.message || 'Erro ao cadastrar usuário.');
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="#f5f5f5" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Paper sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2}>Cadastrar Usuário</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Nome completo" name="name" value={form.name} onChange={handleChange} required fullWidth />
            <TextField label="Nome de usuário (login)" name="username" value={form.username} onChange={handleChange} required fullWidth />
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} required fullWidth type="email" />
            <TextField label="Senha" name="password" value={form.password} onChange={handleChange} required fullWidth type="password" />
            <TextField
              select
              label="Empresas"
              name="empresas"
              value={form.empresas}
              onChange={handleEmpresasChange}
              required
              fullWidth
              SelectProps={{ multiple: true, renderValue: (selected) => selected.map(id => empresas.find(e => e.id === id)?.nome).join(', ') }}
            >
              {empresas.map(e => (
                <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Perfil" name="role" value={form.role} onChange={handleChange} required fullWidth>
              <MenuItem value="tecnico">Usuário</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </TextField>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="success.main">{success}</Typography>}
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary" type="submit">Cadastrar</Button>
              <Button variant="outlined" color="secondary" onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

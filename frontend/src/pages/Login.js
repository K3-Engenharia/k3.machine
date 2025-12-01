import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import logo from '../assets/logo.png';
import API_URL from '../services/apiConfig';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!username || !password) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }
    try {
    console.log('API_URL sendo usado:', API_URL); // Mantenha este console.log para verificar
    const res = await fetch(`${API_URL}/api/auth/login`, { // <<< MUDEI ESTA LINHA
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Erro ao fazer login');
      } else {
        // Salva o token no localStorage e redireciona
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard'; // ajuste para a rota do dashboard futuramente
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <img src={logo} alt="Logo da empresa" style={{ width: 240, marginBottom: 32 }} />
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2} align="center">Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome de usuário"
            type="text"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

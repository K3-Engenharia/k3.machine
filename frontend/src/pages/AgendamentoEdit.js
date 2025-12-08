import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../components/BackToDashboardButton';

export default function AgendamentoEdit() {
  const { agendamentoId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAgendamento() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/equipamentos/${agendamentoId}/agendamentos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Agendamento não encontrado');
        const lista = await res.json();
        const agendamento = lista.find(a => a.id === Number(agendamentoId));
        setForm(agendamento);
      } catch {
        setError('Erro ao buscar agendamento');
      } finally {
        setLoading(false);
      }
    }
    fetchAgendamento();
  }, [agendamentoId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/equipamentos/agendamentos/${agendamentoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Erro ao editar');
      } else {
        navigate(-1);
      }
    } catch {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;
  if (!form) return <Box p={4}><Typography color="error">{error || 'Agendamento não encontrado'}</Typography></Box>;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper sx={{ p: 4, minWidth: 400 }}>
        <BackToDashboardButton />
        <Typography variant="h6" mb={2}>Editar Agendamento</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Data e hora" name="data_hora" type="datetime-local" value={form.data_hora} onChange={handleChange} fullWidth margin="normal" required InputLabelProps={{ shrink: true }} />
          <TextField label="Tempo estimado" name="tempo_estimado" value={form.tempo_estimado} onChange={handleChange} fullWidth margin="normal" placeholder="Ex: 2h" />
          <TextField label="Responsável" name="responsavel" value={form.responsavel} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Checklist" name="checklist" value={form.checklist} onChange={handleChange} fullWidth margin="normal" multiline minRows={2} />
          <TextField label="Observações" name="observacoes" value={form.observacoes} onChange={handleChange} fullWidth margin="normal" multiline minRows={2} />
          <TextField label="Periodicidade" name="periodicidade" value={form.periodicidade} onChange={handleChange} fullWidth margin="normal" />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

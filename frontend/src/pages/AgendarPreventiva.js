import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, MenuItem, CircularProgress, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../components/BackToDashboardButton';
import API_URL from '../services/apiConfig';

const periodicidades = [
  { label: '6 meses', value: '6 meses' },
  { label: '12 meses', value: '12 meses' },
  { label: '1000 horas', value: '1000h' },
  { label: 'Outro', value: 'outro' }
];

export default function AgendarPreventiva() {
  const { id } = useParams();
  const [equipamento, setEquipamento] = useState(null);
  const [form, setForm] = useState({
    data_hora: '',
    tempo_estimado: '',
    responsavel: '',
    checklist: '',
    observacoes: '',
    periodicidade: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEquip() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/equipamentos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Equipamento não encontrado');
        const data = await res.json();
        setEquipamento(data);
      } catch {
        setError('Erro ao buscar equipamento');
      } finally {
        setLoading(false);
      }
    }
    fetchEquip();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/equipamentos/${id}/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Erro ao agendar');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;
  if (!equipamento) return <Box p={4}><Typography color="error">{error || 'Equipamento não encontrado'}</Typography></Box>;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper sx={{ p: 4, minWidth: 400 }}>
        <BackToDashboardButton to={`/equipamentos/${id}/agendamentos`} label="Voltar para Agendamentos" />
        <Typography variant="h6" mb={2}>Agendar Preventiva para:</Typography>
        <Chip label={equipamento.nome} color="primary" sx={{ mb: 2 }} />
        <form onSubmit={handleSubmit}>
          <TextField label="Data e hora" name="data_hora" type="datetime-local" value={form.data_hora} onChange={handleChange} fullWidth margin="normal" required InputLabelProps={{ shrink: true }} />
          <TextField label="Tempo estimado" name="tempo_estimado" value={form.tempo_estimado} onChange={handleChange} fullWidth margin="normal" placeholder="Ex: 2h" />
          <TextField label="Responsável" name="responsavel" value={form.responsavel} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Checklist (livre ou modelo)" name="checklist" value={form.checklist} onChange={handleChange} fullWidth margin="normal" multiline minRows={2} placeholder="Ex: Verificar rolamentos, lubrificação..." />
          <TextField label="Observações" name="observacoes" value={form.observacoes} onChange={handleChange} fullWidth margin="normal" multiline minRows={2} />
          <TextField select label="Periodicidade" name="periodicidade" value={form.periodicidade} onChange={handleChange} fullWidth margin="normal" required>
            {periodicidades.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
          </TextField>
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Salvando...' : 'Agendar'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

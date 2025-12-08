import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Box, Paper, Typography, Chip, CircularProgress, Stack } from '@mui/material';
import BackToDashboardButton from '../components/BackToDashboardButton';
import API_URL from '../services/apiConfig';

const statusColors = {
  'Agendado': 'primary',
  'Concluído': 'success',
  'Cancelado': 'default'
};

export default function AgendamentosCalendario() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAgendamentos() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/equipamentos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Erro ao buscar equipamentos');
        const equipamentos = await res.json();
        let ags = [];
        for (const eq of equipamentos) {
          const resAg = await fetch(`${API_URL}/api/equipamentos/${eq.id}/agendamentos`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (resAg.ok) {
            const lista = await resAg.json();
            ags = ags.concat(lista.map(a => ({ ...a, equipamento_nome: eq.nome })));
          }
        }
        setAgendamentos(ags);
      } catch {
        setError('Erro ao buscar agendamentos');
      } finally {
        setLoading(false);
      }
    }
    fetchAgendamentos();
  }, []);

  const events = agendamentos.map(a => ({
    title: `${a.equipamento_nome} - ${a.responsavel}`,
    start: a.data_hora,
    color: a.status === 'Concluído' ? '#2e7d32' : (a.status === 'Agendado' ? '#1976d2' : '#888'),
    extendedProps: { status: a.status, checklist: a.checklist, observacoes: a.observacoes }
  }));

  return (
    <Box p={4}>
      <BackToDashboardButton />
      <Typography variant="h5" mb={2}>Calendário de Agendamentos</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip label="Agendado" color="primary" />
          <Chip label="Concluído" color="success" />
          <Chip label="Cancelado" color="default" />
        </Stack>
      </Paper>
      {error && <Typography color="error">{error}</Typography>}
      {loading ? <CircularProgress /> : (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale={ptBrLocale}
          height="auto"
          events={events}
          eventContent={renderEventContent}
        />
      )}
    </Box>
  );
}

function renderEventContent(eventInfo) {
  let bg = '#1976d2', color = '#fff';
  if (eventInfo.event.extendedProps.status === 'Concluído') {
    bg = '#2e7d32';
  } else if (eventInfo.event.extendedProps.status === 'Cancelado') {
    bg = '#bdbdbd';
    color = '#333';
  }
  return (
    <div style={{ background: bg, color, borderRadius: 6, padding: '2px 4px', fontSize: 13, fontWeight: 500 }}>
      <b>{eventInfo.timeText}</b> <span>{eventInfo.event.title}</span>
      <div style={{ fontSize: 11, color: color === '#fff' ? '#e0e0e0' : '#555' }}>{eventInfo.event.extendedProps.status}</div>
    </div>
  );
}

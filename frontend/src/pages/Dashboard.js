import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Card, CardContent, Chip, IconButton, Tooltip, Button, Stack, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import AdminActionsMenu from '../components/AdminActionsAccordion';
import API_URL from '../services/apiConfig';

console.log('API_URL:', API_URL);

const statusColors = {
  'Em Operação': 'success',
  'Em Manutenção': 'warning',
  'Desativado': 'default'
};

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [equipamentos, setEquipamentos] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchKpis() {
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          setError('Erro ao buscar dados do dashboard');
          return;
        }
        const data = await res.json();
        setKpis(data);
      } catch (e) {
        setError('Erro de conexão com o servidor');
      }
    }
    async function fetchEquipamentos() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/equipamentos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          console.log('Equipamentos recebidos:', data);
          setEquipamentos(data);
        }
      } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
      }
    }
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    }
    fetchKpis();
    fetchEquipamentos();
  }, []);

  return (
    <Box p={4} minHeight="100vh" bgcolor="#f5f5f5">
      <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <img src={logo} alt="Logo da empresa" style={{ width: 180, maxWidth: '100%', height: 'auto' }} />
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {!kpis && !error && <CircularProgress />}
      {kpis && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 4 }}>
              <Typography variant="h6" color="text.secondary">Equipamentos cadastrados</Typography>
              <Typography variant="h2" color="primary" fontWeight={700}>{kpis.equipamentos}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 4 }}>
              <Typography variant="h6" color="text.secondary">Preventivas em dia</Typography>
              <Typography variant="h2" color="success.main" fontWeight={700}>{kpis.preventivasEmDia}%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 4 }}>
              <Typography variant="h6" color="text.secondary">Próximas intervenções</Typography>
              <Typography variant="h2" color="warning.main" fontWeight={700}>{kpis.proximasIntervencoes}</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>Equipamentos</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="contained" color="primary" onClick={() => navigate('/equipamentos/novo')}>
            Cadastrar Equipamento
          </Button>
          <Button variant="outlined" color="info" onClick={() => navigate('/agendamentos/calendario')}>
            Ver calendário de agendamentos
          </Button>
          {user && user.role === 'admin' && <AdminActionsMenu />}
          <Button variant="outlined" color="error" onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}>
            Sair
          </Button>
        </Stack>
      </Box>
      {equipamentos.length === 0 && (
        <Typography color="text.secondary" ml={2}>Nenhum equipamento cadastrado.</Typography>
      )}

      {(() => {
        // Agrupar equipamentos por empresa
        const equipamentosPorEmpresa = equipamentos.reduce((acc, equip) => {
          const empresaNome = equip.empresa?.nome || 'Sem empresa';
          if (!acc[empresaNome]) {
            acc[empresaNome] = [];
          }
          acc[empresaNome].push(equip);
          return acc;
        }, {});

        // Renderizar cada seção de empresa
        return Object.entries(equipamentosPorEmpresa).map(([empresa, equipamentosEmpresa], index) => (
          <Box key={empresa} mb={4}>
            <Box 
              display="flex" 
              alignItems="center" 
              mb={2}
              sx={{
                borderBottom: '2px solid #1976d2',
                paddingBottom: 1
              }}
            >
              <Typography variant="h6" color="primary">
                {empresa} ({equipamentosEmpresa.length} equipamento{equipamentosEmpresa.length !== 1 ? 's' : ''})
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {equipamentosEmpresa.map(e => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={e.id}>
            <Card sx={{ minHeight: 200, boxShadow: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ height: 200, overflow: 'hidden', borderRadius: 1, mb: 1 }}>
                <img
                  src={e.foto ? `${API_URL}/api${e.foto}` : `${API_URL}/api/uploads/placeholder.png`}
                  alt={e.nome}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    backgroundColor: '#f0f0f0'
                  }}
                />
              </Box>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" fontWeight={700}>{e.nome}</Typography>
                    <Tooltip title="Editar">
                      <IconButton color="primary" size="small" onClick={() => navigate(`/equipamentos/editar/${e.id}`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {user && user.role === 'admin' && (
                      <Tooltip title="Excluir">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={async () => {
                            if (window.confirm('Tem certeza que deseja excluir este equipamento?')) {
                              const token = localStorage.getItem('token');
                              await fetch(`${API_URL}/api/equipamentos/${e.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              setEquipamentos(equipamentos.filter(eq => eq.id !== e.id));
                            }
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Tooltip title="Agendamentos">
                    <IconButton color="info" size="small" onClick={() => navigate(`/equipamentos/${e.id}/agendamentos`)}>
                      <AccessTimeIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body2" color="text.secondary">{e.empresa?.nome || 'Sem empresa'}</Typography>
                <Typography variant="body2" color="text.secondary">{e.local_instalado}</Typography>
                <Typography variant="body2">Potência: <b>{e.potencia || '-'}</b> CV</Typography>
                <Typography variant="body2">Corrente: <b>{e.corrente_nominal || '-'}</b> A</Typography>
                <Typography variant="body2">Tensão: <b>{e.tensao_nominal || '-'}</b> V</Typography>
                <Chip label={e.status || 'Em Operação'} color={statusColors[e.status] || 'default'} size="small" sx={{ mt: 1 }} />
                {(() => {
                  try {
                    console.log('Tentando formatar data para equipamento:', e.nome);
                    console.log('Valor de proximo_agendamento:', e.proximo_agendamento);
                    
                    // Se não houver data agendada, não mostra nada
                    if (!e.proximo_agendamento) {
                      console.log('Sem agendamento para:', e.nome);
                      return null;
                    }
                    
                    // Validar formato da data
                    if (typeof e.proximo_agendamento !== 'string' || !e.proximo_agendamento.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                      console.error('Formato de data inválido:', e.proximo_agendamento);
                      return null;
                    }
                    
                    const formatter = new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      timeZone: 'America/Sao_Paulo'
                    });
                    
                    const data = new Date(e.proximo_agendamento);
                    console.log('Data parseada:', data);
                    
                    if (isNaN(data.getTime())) {
                      throw new Error('Data inválida após conversão');
                    }
                    
                    const dataFormatada = formatter.format(data);
                    console.log('Data formatada:', dataFormatada);
                    
                    return (
                      <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                        Próxima preventiva: {dataFormatada}
                      </Typography>
                    );
                    
                  } catch (error) {
                    console.error('Erro ao formatar data para equipamento:', e.nome, error);
                    return null;
                  }
                })()}
              </CardContent>
            </Card>
          </Grid>
        ))}
            </Grid>

            {/* Adiciona uma divisória entre as seções de empresas */}
            {index < Object.entries(equipamentosPorEmpresa).length - 1 && (
              <Box mt={3} mb={3}>
                <Divider />
              </Box>
            )}
          </Box>
        ));
      })()}
    </Box>
  );
}

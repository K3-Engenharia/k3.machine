import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import BackToDashboardButton from '../components/BackToDashboardButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from '@mui/icons-material/Close';


export default function EquipamentosList() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  
  // Fetch user from localStorage and decode token
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchEquipamentos() {
      setError('');
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        let url = `${API_URL}/api/equipamentos`;
        if (user && user.role !== 'admin' && user.empresa_id) {
          url += `?empresa_id=${user.empresa_id}`;
        }
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          setError('Erro ao buscar equipamentos');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setEquipamentos(data);
      } catch (e) {
        setError('Erro de conexão com o servidor');
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchEquipamentos();
  }, [user]);

  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const res = await fetch(`${API_URL}/api/empresas`);
        setEmpresas(await res.json());
      } catch {
        setEmpresas([]);
      }
    }
    fetchEmpresas();
  }, []);

  if (!user) return null;

  return (
    <Box p={4}>
      <BackToDashboardButton />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Equipamentos</Typography>
        <Button component={Link} to="/equipamentos/novo" variant="contained" color="primary">Novo Equipamento</Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Empresa</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Fabricante</TableCell>
                <TableCell>Local</TableCell>
                <TableCell>Data Instalação</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipamentos.map(e => (
                <TableRow key={e.id}>
                  <TableCell>{empresas.find(emp => emp.id === e.empresa_id)?.nome || '-'}</TableCell>
                  <TableCell>{e.nome}</TableCell>
                  <TableCell>{e.tipo}</TableCell>
                  <TableCell>{e.modelo}</TableCell>
                  <TableCell>{e.fabricante}</TableCell>
                  <TableCell>{e.local_instalado}</TableCell>
                  <TableCell>{e.data_instalacao}</TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <IconButton component={Link} to={`/equipamentos/${e.id}/agendamentos`} color="primary">
                        <EventIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        sx={{ mt: 1 }}
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
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

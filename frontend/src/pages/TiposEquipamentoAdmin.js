import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import LocaisInstaladosAdmin from '../components/LocaisInstaladosAdmin';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import API_URL from '../services/apiConfig';

const TIPOS_API_URL = `${API_URL}/api/tipos-equipamento`;

export default function TiposEquipamentoAdmin() {
  const [tipos, setTipos] = useState([]);
  const [novoTipo, setNovoTipo] = useState('');
  const [editando, setEditando] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const fetchTipos = async () => {
    const res = await fetch(TIPOS_API_URL);
    const data = await res.json();
    setTipos(data);
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleAdd = async () => {
    if (!novoTipo.trim()) return;
    await fetch(TIPOS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novoTipo })
    });
    setNovoTipo('');
    fetchTipos();
  };

  const handleEdit = (tipo) => {
    setEditando(tipo.id);
    setEditNome(tipo.nome);
    setOpenDialog(true);
  };

  const handleEditSave = async () => {
    await fetch(`${TIPOS_API_URL}/${editando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: editNome })
    });
    setOpenDialog(false);
    setEditando(null);
    setEditNome('');
    fetchTipos();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo?')) {
      await fetch(`${TIPOS_API_URL}/${id}`, { method: 'DELETE' });
      fetchTipos();
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        onClick={() => navigate('/dashboard')}
      >
        Voltar para o Dashboard
      </Button>
      <Typography variant="h5" gutterBottom>Gerenciar Tipos de Equipamento</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Novo tipo"
          value={novoTipo}
          onChange={e => setNovoTipo(e.target.value)}
          size="small"
          fullWidth
        />
        <Button variant="contained" onClick={handleAdd}>Adicionar</Button>
      </Box>
      <List>
        {tipos.map(tipo => (
          <ListItem
            key={tipo.id}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleEdit(tipo)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" color="error" onClick={() => handleDelete(tipo.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={tipo.nome} />
          </ListItem>
        ))}
      </List>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Tipo</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do tipo"
            value={editNome}
            onChange={e => setEditNome(e.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditSave}>Salvar</Button>
        </DialogActions>
      </Dialog>
      <LocaisInstaladosAdmin />
    </Box>
  );
}
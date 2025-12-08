import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmpresaSelect from './EmpresaSelect';
import API_URL from '../services/apiConfig';

const LOCAIS_API_URL = `${API_URL}/api/locais-instalados`;

export default function LocaisInstaladosAdmin() {
  const [locais, setLocais] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [empresaId, setEmpresaId] = useState('');
  const [novoLocal, setNovoLocal] = useState('');
  const [editando, setEditando] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/empresas`)
      .then(res => res.json())
      .then(setEmpresas)
      .catch(() => setEmpresas([]));
  }, []);

  useEffect(() => {
    if (!empresaId) {
      setLocais([]);
      return;
    }
    const token = localStorage.getItem('token');
    fetch(`${LOCAIS_API_URL}?empresa_id=${empresaId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setLocais)
      .catch(() => setLocais([]));
  }, [empresaId]);

  const handleAdd = async () => {
    if (!novoLocal.trim() || !empresaId) return;
    const token = localStorage.getItem('token');
    await fetch(LOCAIS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome: novoLocal, empresa_id: empresaId })
    });
    setNovoLocal('');
    // Atualiza lista
    const res = await fetch(`${LOCAIS_API_URL}?empresa_id=${empresaId}`, { headers: { Authorization: `Bearer ${token}` } });
    setLocais(await res.json());
  };

  const handleEdit = (local) => {
    setEditando(local.id);
    setEditNome(local.nome);
    setOpenDialog(true);
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${LOCAIS_API_URL}/${editando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome: editNome })
    });
    setOpenDialog(false);
    setEditando(null);
    setEditNome('');
    // Atualiza lista
    const res = await fetch(`${LOCAIS_API_URL}?empresa_id=${empresaId}`, { headers: { Authorization: `Bearer ${token}` } });
    setLocais(await res.json());
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este local?')) {
      const token = localStorage.getItem('token');
      await fetch(`${LOCAIS_API_URL}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      // Atualiza lista
      const res = await fetch(`${LOCAIS_API_URL}?empresa_id=${empresaId}`, { headers: { Authorization: `Bearer ${token}` } });
      setLocais(await res.json());
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Gerenciar Locais Instalados</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Empresa"
          value={empresaId}
          onChange={e => setEmpresaId(e.target.value)}
          size="small"
          sx={{ minWidth: 160, flex: 2 }}
        >
          {empresas.map(e => (
            <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Novo local"
          value={novoLocal}
          onChange={e => setNovoLocal(e.target.value)}
          size="small"
          sx={{ flex: 3, minWidth: 120 }}
        />
        <Button variant="contained" onClick={handleAdd} sx={{ minWidth: 120, flexShrink: 0, alignSelf: 'center' }}>Adicionar</Button>
      </Box>
      <List>
        {locais.map(local => (
          <ListItem
            key={local.id}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleEdit(local)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" color="error" onClick={() => handleDelete(local.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={local.nome} />
          </ListItem>
        ))}
      </List>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Local</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do local"
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
    </Box>
  );
}

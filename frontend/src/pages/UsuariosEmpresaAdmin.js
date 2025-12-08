import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, CircularProgress } from '@mui/material';
import BackToDashboardButton from '../components/BackToDashboardButton';
import API_URL from '../services/apiConfig'; // Confirme que este caminho está correto

export default function UsuariosEmpresaAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(''); // Limpa erros anteriores ao tentar buscar novamente
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de autenticação não encontrado. Faça login novamente.');
        }

        // Requisição para usuários pendentes
        const resUsersPromise = fetch(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Requisição para empresas
        const resEmpresasPromise = fetch(`${API_URL}/api/empresas`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const [resUsers, resEmpresas] = await Promise.all([resUsersPromise, resEmpresasPromise]);

        if (!resUsers.ok) {
          const errorData = await resUsers.json();
          throw new Error(errorData.message || 'Erro ao carregar usuários pendentes');
        }
        if (!resEmpresas.ok) {
          const errorData = await resEmpresas.json();
          throw new Error(errorData.message || 'Erro ao carregar empresas');
        }

        const users = await resUsers.json();
        const emps = await resEmpresas.json();

        setUsuarios(users);
        setEmpresas(emps);

      } catch (err) {
        console.error("Erro ao buscar dados para UsuariosEmpresaAdmin:", err);
        setError('Erro ao buscar dados: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const handleEmpresaChange = async (userId, empresa_id) => {
    setError(''); // Limpa erros anteriores
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const res = await fetch(`${API_URL}/api/admin/set-empresas/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ empresas: [empresa_id] })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Falha ao atualizar empresa do usuário');
      }

      setUsuarios(prevUsuarios =>
        prevUsuarios.map(u => (u.id === userId ? { ...u, empresa_id } : u))
      );
      // alert('Empresa do usuário atualizada com sucesso!'); // Feedback de sucesso
    } catch (err) {
      console.error("Erro ao atualizar empresa do usuário:", err);
      setError('Erro ao atualizar empresa do usuário: ' + err.message);
    }
  };

  const handleApproveUser = async (userId) => {
    setError(''); // Limpa erros anteriores
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const res = await fetch(`${API_URL}/api/admin/approve/${userId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Falha ao aprovar usuário');
      }

      setUsuarios(prevUsuarios =>
        prevUsuarios.map(user =>
          user.id === userId ? { ...user, is_approved: 1 } : user
        )
      );
      // alert('Usuário aprovado com sucesso!'); // Feedback de sucesso
    } catch (err) {
      console.error("Erro ao aprovar usuário:", err);
      setError('Erro ao aprovar usuário: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setError(''); // Limpa erros anteriores
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de autenticação não encontrado.');
        }

        const res = await fetch(`${API_URL}/api/admin/delete/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Falha ao excluir usuário');
        }

        setUsuarios(prevUsuarios => prevUsuarios.filter(user => user.id !== userId));
        // alert('Usuário excluído com sucesso!'); // Feedback de sucesso
      } catch (err) {
        console.error("Erro ao excluir usuário:", err);
        setError('Erro ao excluir usuário: ' + err.message);
      }
    }
  };

  const handleChangePassword = async (userId) => {
    setError(''); // Limpa erros anteriores
    const novaSenha = prompt('Digite a nova senha para este usuário:');
    if (novaSenha && novaSenha.length >= 4) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de autenticação não encontrado.');
        }

        const res = await fetch(`${API_URL}/api/admin/change-password/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ password: novaSenha })
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Falha ao alterar senha');
        }

        alert('Senha alterada com sucesso!');
      } catch (err) {
        console.error("Erro ao alterar senha:", err);
        setError('Erro ao alterar senha: ' + err.message);
      }
    } else if (novaSenha !== null) { // Usuário não cancelou, mas a senha é inválida
      alert('A senha deve ter pelo menos 4 caracteres.');
    }
  };

  return (
    <Box p={4}>
      <BackToDashboardButton />
      <Typography variant="h5" mb={2}>Usuários Pendentes - Definir Empresa e Aprovação</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Aprovação</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map(u => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Select
                      value={u.empresa_id || ''}
                      onChange={e => handleEmpresaChange(u.id, e.target.value)}
                      displayEmpty
                      size="small"
                    >
                      <MenuItem value=""><em>Selecione</em></MenuItem>
                      {empresas.map(emp => (
                        <MenuItem key={emp.id} value={emp.id}>{emp.nome}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {u.is_approved ? (
                      <Typography color="success.main">Aprovado</Typography>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleApproveUser(u.id)} // Chama a função separada
                        disabled={!u.empresa_id}
                      >
                        Aprovar
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {u.role !== 'admin' && ( // Evita excluir o próprio admin se ele estiver na lista
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteUser(u.id)} // Chama a função separada
                      >
                        Excluir
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => handleChangePassword(u.id)} // Chama a função separada
                    >
                      Alterar Senha
                    </Button>
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
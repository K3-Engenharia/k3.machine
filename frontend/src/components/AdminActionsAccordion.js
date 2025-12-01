import React from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import BuildIcon from '@mui/icons-material/Build';

export default function AdminActionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        endIcon={<ExpandMoreIcon />}
        onClick={handleClick}
        sx={{ minWidth: 180 }}
      >
        Ações Administrativas
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ sx: { minWidth: 220 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableScrollLock
        elevation={3}
      >
        <MenuItem onClick={() => { handleClose(); navigate('/empresas/nova'); }}>
          <ListItemIcon><BusinessIcon color="success" /></ListItemIcon>
          <ListItemText primary="Cadastrar Empresa" />
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/admin/usuarios-criar'); }}>
          <ListItemIcon><PersonAddIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Cadastrar Usuário" />
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/admin/usuarios-empresa'); }}>
          <ListItemIcon><GroupIcon color="secondary" /></ListItemIcon>
          <ListItemText primary="Gerenciar Empresas dos Usuários" />
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/admin/tipos-equipamento'); }}>
        <ListItemIcon><BuildIcon color="warning" /></ListItemIcon>
        <ListItemText primary="Gerenciar dados de Equipamento" />
        </MenuItem>
      </Menu>
    </>
  );
}

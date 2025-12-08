import express from 'express';
import { approveUserById, listAllUsers, setUserEmpresas, deleteUser, changeUserPassword, createUserWithEmpresas } from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Listar usuários pendentes de aprovação
router.get('/users', authenticateToken, authorizeRoles('admin'), listAllUsers);

// Aprovar usuário
router.post('/approve/:id', authenticateToken, authorizeRoles('admin'), approveUserById);

// Definir empresas do usuário (múltiplas)
router.post('/set-empresas/:id', authenticateToken, authorizeRoles('admin'), setUserEmpresas);

// Criar usuário com múltiplas empresas
router.post('/create', authenticateToken, authorizeRoles('admin'), createUserWithEmpresas);

// Excluir usuário
router.delete('/delete/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

// Alterar senha do usuário
router.post('/change-password/:id', authenticateToken, authorizeRoles('admin'), changeUserPassword);

export default router;

import express from 'express';
import { cadastrarEquipamento, listarEquipamentos, buscarEquipamento, atualizarEquipamento, excluirEquipamento } from '../controllers/equipamentoController.js';
import { agendarPreventiva, listarAgendamentos, editarAgendamento, alterarStatusAgendamento } from '../controllers/agendamentoController.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../config/upload.js';

const router = express.Router();

router.get('/', authenticateToken, listarEquipamentos);
router.post('/', authenticateToken, upload.single('foto'), cadastrarEquipamento);
router.get('/:id', authenticateToken, buscarEquipamento);
router.put('/:id', authenticateToken, upload.single('foto'), atualizarEquipamento);
router.delete('/:id', authenticateToken, excluirEquipamento);
router.post('/:id/agendamentos', authenticateToken, agendarPreventiva);
router.get('/:id/agendamentos', authenticateToken, listarAgendamentos);
router.put('/agendamentos/:agendamentoId', authenticateToken, editarAgendamento);
router.patch('/agendamentos/:agendamentoId/status', authenticateToken, alterarStatusAgendamento);

export default router;

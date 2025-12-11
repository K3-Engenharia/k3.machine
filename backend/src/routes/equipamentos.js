import express from 'express';
import { cadastrarEquipamento, listarEquipamentos, buscarEquipamento, atualizarEquipamento, excluirEquipamento } from '../controllers/equipamentoController.js';
import { agendarPreventiva, listarAgendamentos, editarAgendamento, alterarStatusAgendamento, buscarAgendamento } from '../controllers/agendamentoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rotas de agendamentos (mais específicas, devem vir antes)
router.get('/agendamentos/:agendamentoId', authenticateToken, buscarAgendamento);
router.put('/agendamentos/:agendamentoId', authenticateToken, editarAgendamento);
router.patch('/agendamentos/:agendamentoId/status', authenticateToken, alterarStatusAgendamento);

// Rotas de equipamentos
router.get('/', authenticateToken, listarEquipamentos);
router.post('/', authenticateToken, cadastrarEquipamento);
router.get('/:id', authenticateToken, buscarEquipamento);
router.put('/:id', authenticateToken, atualizarEquipamento);
router.delete('/:id', authenticateToken, excluirEquipamento);
router.post('/:id/agendamentos', authenticateToken, agendarPreventiva);
router.get('/:id/agendamentos', authenticateToken, listarAgendamentos);

export default router;

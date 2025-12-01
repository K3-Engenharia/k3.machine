import express from 'express';
import { criarEmpresa, listarEmpresas, buscarEmpresaPorId } from '../controllers/empresaController.js';

const router = express.Router();

router.post('/', criarEmpresa);
router.get('/', listarEmpresas);
router.get('/:id', buscarEmpresaPorId);

export default router;

import express from 'express';
import {
  getAllTiposEquipamento,
  createTipoEquipamento,
  updateTipoEquipamento,
  deleteTipoEquipamento
} from '../models/tipoEquipamentoModel.js';

const router = express.Router();

// Listar todos os tipos
router.get('/', async (req, res) => {
  const tipos = await getAllTiposEquipamento();
  res.json(tipos);
});

// Criar novo tipo
router.post('/', async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ message: 'Nome obrigatório' });
  const tipo = await createTipoEquipamento(nome);
  res.status(201).json(tipo);
});

// Editar tipo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ message: 'Nome obrigatório' });
  const tipo = await updateTipoEquipamento(id, nome);
  res.json(tipo);
});

// Deletar tipo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await deleteTipoEquipamento(id);
  res.json({ message: 'Tipo excluído com sucesso' });
});

export default router;

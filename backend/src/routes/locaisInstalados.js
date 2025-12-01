// backend/src/routes/locaisInstalados.js
import express from 'express';
import localInstaladoModel from '../models/localInstaladoModel.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { empresa_id } = req.query;
    const locais = await localInstaladoModel.getAllLocaisInstalados(empresa_id);
    res.json(locais);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, empresa_id } = req.body;
    if (!empresa_id) return res.status(400).json({ error: 'empresa_id é obrigatório' });
    const novo = await localInstaladoModel.createLocalInstalado(nome, empresa_id);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nome } = req.body;
    const { id } = req.params;
    const atualizado = await localInstaladoModel.updateLocalInstalado(id, nome);
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await localInstaladoModel.deleteLocalInstalado(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

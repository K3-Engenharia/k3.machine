import { createEmpresa, listEmpresas, getEmpresaById } from '../models/empresaModel.js';

export async function criarEmpresa(req, res) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ message: 'Nome da empresa é obrigatório' });
  try {
    const empresa = await createEmpresa(nome);
    res.status(201).json(empresa);
  } catch (e) {
    res.status(400).json({ message: 'Erro ao criar empresa: ' + e.message });
  }
}

export async function listarEmpresas(req, res) {
  const empresas = await listEmpresas();
  res.json(empresas);
}

export async function buscarEmpresaPorId(req, res) {
  const { id } = req.params;
  const empresa = await getEmpresaById(id);
  if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
  res.json(empresa);
}

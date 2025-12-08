import { createEquipamento, listEquipamentos, getEquipamentoById, updateEquipamento, deleteEquipamento } from '../models/equipamentoModel.js';
import { getProximoAgendamentoPorEquipamento } from '../models/agendamentoModel.js';

export async function cadastrarEquipamento(req, res) {
  try {
    const equip = req.body;
    if (!equip.nome || !equip.tipo || !equip.empresa_id) {
      return res.status(400).json({ message: 'Nome, tipo e empresa são obrigatórios' });
    }

    // A foto já vem como Base64 no req.body (se foi enviada)
    // Se não tiver foto, deixa como null
    if (!equip.foto) {
      equip.foto = null;
    }

    const novo = await createEquipamento(equip);
    res.status(201).json(novo);
  } catch (e) {
    console.error('Erro ao cadastrar equipamento:', e);
    res.status(500).json({ message: 'Erro ao cadastrar equipamento', error: e.message });
  }
}

export async function listarEquipamentos(req, res) {
  try {
    // Se admin, vê todos. Se não, filtra pelas empresas do usuário
    let lista = [];
    if (req.user.role === 'admin') {
      lista = await listEquipamentos();
    } else if (Array.isArray(req.user.empresas) && req.user.empresas.length > 0) {
      lista = await listEquipamentos({ empresas: req.user.empresas });
    } else {
      lista = [];
    }
    res.json(lista);
  } catch (e) {
    res.status(500).json({ message: 'Erro ao listar equipamentos' });
  }
}

export async function buscarEquipamento(req, res) {
  try {
    console.log('Buscando equipamento ID:', req.params.id);
    const equip = await getEquipamentoById(req.params.id);
    console.log('Resultado do banco:', equip);
    if (!equip) return res.status(404).json({ message: 'Equipamento não encontrado' });
    
    // Buscar próximo agendamento
    // Buscar próximo agendamento
    try {
      const proximo = await getProximoAgendamentoPorEquipamento(req.params.id);
      console.log('Próximo agendamento:', proximo);
      
      if (proximo && proximo.data_hora) {
        const dataHora = new Date(proximo.data_hora);
        if (!isNaN(dataHora.getTime())) {
          console.log('Data válida encontrada:', dataHora);
          equip.proximo_agendamento = dataHora.toISOString();
        } else {
          console.log('Data inválida encontrada');
          equip.proximo_agendamento = null;
        }
      } else {
        console.log('Nenhum próximo agendamento encontrado');
        equip.proximo_agendamento = null;
      }
    } catch (error) {
      console.error('Erro ao buscar próximo agendamento:', error);
      equip.proximo_agendamento = null;
    }
    
    console.log('Equipamento com próximo agendamento:', equip);
    res.json(equip);
  } catch (e) {
    console.error('Erro ao buscar equipamento:', e);
    res.status(500).json({ message: 'Erro ao buscar equipamento' });
  }
}

export async function atualizarEquipamento(req, res) {
  try {
    console.log('Dados recebidos:', { body: req.body, file: req.file });
    
    // Quando usando multipart/form-data, os campos vêm como strings
    const equip = {
      ...req.body,
      empresa_id: req.body.empresa_id
    };

    if (!equip.nome || !equip.tipo || !equip.empresa_id) {
      return res.status(400).json({ message: 'Nome, tipo e empresa são obrigatórios' });
    }

    // Atualiza a foto se uma nova foi enviada
    if (req.file) {
      equip.foto = `/uploads/${req.file.filename}`;
      console.log('Nova foto:', equip.foto);
    }

    console.log('Dados para atualização:', equip);

    const equipamentoExistente = await getEquipamentoById(req.params.id);
    if (!equipamentoExistente) {
      return res.status(404).json({ message: 'Equipamento não encontrado' });
    }

    // Se não enviou foto nova, mantém a foto atual
    if (!equip.foto && equipamentoExistente.foto) {
      equip.foto = equipamentoExistente.foto;
    }

    const atualizado = await updateEquipamento(req.params.id, equip);
    console.log('Equipamento atualizado:', atualizado);
    res.json(atualizado);
  } catch (e) {
    console.error('Erro ao atualizar equipamento:', e);
    res.status(500).json({ message: 'Erro ao atualizar equipamento', error: e.message });
  }
}

export async function excluirEquipamento(req, res) {
  try {
    await deleteEquipamento(req.params.id);
    res.json({ message: 'Equipamento excluído com sucesso' });
  } catch (e) {
    res.status(500).json({ message: 'Erro ao excluir equipamento' });
  }
}

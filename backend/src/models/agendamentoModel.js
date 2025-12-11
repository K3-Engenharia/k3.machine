import { getCollection } from './db.js';
import { ObjectId } from 'mongodb';

function calcularProximoAgendamento(data_hora, periodicidade) {
    if (!data_hora || !periodicidade) return null;
    const data = new Date(data_hora);
    if (periodicidade.includes('mes')) {
        const meses = parseInt(periodicidade);
        data.setMonth(data.getMonth() + meses);
        return data.toISOString().slice(0, 16);
    }
    if (periodicidade.includes('1000h')) {
        data.setHours(data.getHours() + 1000);
        return data.toISOString().slice(0, 16);
    }
    return null;
}

export async function criarAgendamento(equipamento_id, agendamento) {
    const collection = await getCollection('agendamentos');
    
    // Garantir que a data está no formato correto
    const dataHora = new Date(agendamento.data_hora);
    if (isNaN(dataHora.getTime())) {
        throw new Error('Data inválida');
    }
    
    const agendamentoDoc = {
        ...agendamento,
        equipamento_id: new ObjectId(equipamento_id),
        data_hora: dataHora,
        proximo_agendamento: calcularProximoAgendamento(agendamento.data_hora, agendamento.periodicidade),
        status: 'Agendado',
        created_at: new Date()
    };

    const result = await collection.insertOne(agendamentoDoc);
    return {
        id: result.insertedId.toString(),
        ...agendamentoDoc,
        equipamento_id: agendamentoDoc.equipamento_id.toString()
    };
}

export async function getProximoAgendamentoPorEquipamento(equipamento_id) {
    const collection = await getCollection('agendamentos');
    console.log('Buscando próximo agendamento para equipamento:', equipamento_id);
    
    // Primeiro, vamos listar todos os agendamentos para debug
    const todosAgendamentos = await collection
        .find({ 
            equipamento_id: new ObjectId(equipamento_id),
            status: 'Agendado'
        })
        .toArray();
    console.log('Todos os agendamentos encontrados:', todosAgendamentos);
    
    // Filtrar agendamentos futuros
    const agendamentosFuturos = todosAgendamentos.filter(agend => {
        try {
            const dataAgendamento = new Date(agend.data_hora);
            const agora = new Date();
            return !isNaN(dataAgendamento.getTime()) && dataAgendamento > agora;
        } catch (error) {
            console.error('Erro ao processar data do agendamento:', error);
            return false;
        }
    });
    
    console.log('Agendamentos futuros:', agendamentosFuturos);
    
    // Ordenar por data e pegar o próximo
    const proximosAgendamentos = agendamentosFuturos.sort((a, b) => {
        return new Date(a.data_hora) - new Date(b.data_hora);
    });
    
    const agendamento = proximosAgendamentos[0];

    console.log('Agendamento encontrado:', agendamento);
    console.log('Tipo da data do agendamento:', agendamento?.data_hora instanceof Date ? 'Date' : typeof agendamento?.data_hora);

    if (agendamento) {
        // Garantir que a data está no formato correto
        const dataHora = agendamento.data_hora instanceof Date ? 
                        agendamento.data_hora : 
                        new Date(agendamento.data_hora);

        const resultado = {
            ...agendamento,
            id: agendamento._id.toString(),
            equipamento_id: agendamento.equipamento_id.toString(),
            data_hora: dataHora
        };
        
        console.log('Resultado formatado:', resultado);
        return resultado;
    }
    return null;
}

export async function contarProximasIntervencoes(empresas = null) {
    const agendamentosCollection = await getCollection('agendamentos');
    const equipamentosCollection = await getCollection('equipamentos');

    let matchEquipamentos = {};
    if (empresas && Array.isArray(empresas) && empresas.length > 0) {
        matchEquipamentos = {
            empresa_id: { $in: empresas.map(id => new ObjectId(id)) }
        };
    }

    const equipamentos = await equipamentosCollection.find(matchEquipamentos).toArray();
    const equipamentoIds = equipamentos.map(e => e._id);

    return await agendamentosCollection.countDocuments({
        equipamento_id: { $in: equipamentoIds },
        status: 'Agendado',
        data_hora: { $gte: new Date() }
    });
}

export async function listarAgendamentosPorEquipamento(equipamento_id) {
    const collection = await getCollection('agendamentos');
    const agendamentos = await collection
        .find({ equipamento_id: new ObjectId(equipamento_id) })
        .sort({ data_hora: -1 })
        .toArray();

    return agendamentos.map(agendamento => ({
        ...agendamento,
        id: agendamento._id.toString(),
        equipamento_id: agendamento.equipamento_id.toString()
    }));
}

export async function getAgendamentoById(id) {
    const collection = await getCollection('agendamentos');
    const agendamento = await collection.findOne({ _id: new ObjectId(id) });
    return agendamento;
}

export async function atualizarAgendamento(id, agendamento) {
    const collection = await getCollection('agendamentos');
    const updateDoc = {
        ...agendamento,
        equipamento_id: new ObjectId(agendamento.equipamento_id)
    };

    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateDoc }
    );

    const updatedAgendamento = await collection.findOne({ _id: new ObjectId(id) });
    return {
        ...updatedAgendamento,
        id: updatedAgendamento._id.toString(),
        equipamento_id: updatedAgendamento.equipamento_id.toString()
    };
}

export async function atualizarStatusAgendamento(id, status) {
    const collection = await getCollection('agendamentos');
    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
    );

    const updatedAgendamento = await collection.findOne({ _id: new ObjectId(id) });
    return {
        ...updatedAgendamento,
        id: updatedAgendamento._id.toString(),
        equipamento_id: updatedAgendamento.equipamento_id.toString()
    };
}

export async function contarEquipamentosPreventivaEmDia(empresas = null) {
    const equipamentosCollection = await getCollection('equipamentos');
    const agendamentosCollection = await getCollection('agendamentos');

    let matchEquipamentos = {};
    if (empresas && Array.isArray(empresas) && empresas.length > 0) {
        matchEquipamentos = {
            empresa_id: { $in: empresas.map(id => new ObjectId(id)) }
        };
    }

    const pipeline = [
        { $match: matchEquipamentos },
        {
            $lookup: {
                from: 'agendamentos',
                localField: '_id',
                foreignField: 'equipamento_id',
                as: 'agendamentos'
            }
        },
        {
            $match: {
                $or: [
                    { agendamentos: { $size: 0 } },
                    {
                        'agendamentos': {
                            $not: {
                                $elemMatch: {
                                    status: 'Agendado',
                                    data_hora: { $lt: new Date() }
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            $count: 'total'
        }
    ];

    const result = await equipamentosCollection.aggregate(pipeline).toArray();
    return result.length > 0 ? result[0].total : 0;
}

import { getCollection } from './db.js';
import { ObjectId } from 'mongodb';

export async function createEquipamento(equip) {
    const collection = await getCollection('equipamentos');
    const equipamentoDoc = {
        ...equip,
        status: equip.status || 'Em Operação',
        empresa_id: new ObjectId(equip.empresa_id),
        created_at: new Date()
    };
    
    const result = await collection.insertOne(equipamentoDoc);
    return { 
        id: result.insertedId.toString(),
        ...equipamentoDoc,
        empresa_id: equipamentoDoc.empresa_id.toString()
    };
}

export async function contarEquipamentos(empresas = null) {
    const collection = await getCollection('equipamentos');
    let query = {};

    if (empresas && Array.isArray(empresas) && empresas.length > 0) {
        query.empresa_id = { 
            $in: empresas.map(id => new ObjectId(id))
        };
    }

    return await collection.countDocuments(query);
}

export async function listEquipamentos({ empresa_id, empresas } = {}) {
    const collection = await getCollection('equipamentos');
    let query = {};

    if (empresas && Array.isArray(empresas) && empresas.length > 0) {
        query.empresa_id = { 
            $in: empresas.map(id => new ObjectId(id))
        };
    } else if (empresa_id) {
        query.empresa_id = new ObjectId(empresa_id);
    }

    const equipamentos = await collection
        .aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'empresas',
                    let: { empresaId: '$empresa_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$empresaId'] }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                nome: 1
                            }
                        }
                    ],
                    as: 'empresaData'
                }
            },
            {
                $sort: { created_at: -1 }
            }
        ]).toArray();

    return equipamentos.map(equip => ({
        ...equip,
        id: equip._id.toString(),
        empresa_id: equip.empresa_id.toString(),
        empresa: equip.empresaData[0] ? {
            id: equip.empresaData[0]._id.toString(),
            nome: equip.empresaData[0].nome
        } : null,
        empresaData: undefined // Remove o array do lookup do resultado final
    }));
}

export async function getEquipamentoById(id) {
    const collection = await getCollection('equipamentos');
    
    const [equipamento] = await collection.aggregate([
        { 
            $match: { _id: new ObjectId(id) }
        },
        {
            $lookup: {
                from: 'empresas',
                let: { empresaId: '$empresa_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$empresaId'] }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            nome: 1
                        }
                    }
                ],
                as: 'empresaData'
            }
        }
    ]).toArray();
    
    if (equipamento) {
        return {
            ...equipamento,
            id: equipamento._id.toString(),
            empresa_id: equipamento.empresa_id.toString(),
            empresa: equipamento.empresaData[0] ? {
                id: equipamento.empresaData[0]._id.toString(),
                nome: equipamento.empresaData[0].nome
            } : null,
            empresaData: undefined // Remove o array do lookup do resultado final
        };
    }
    return null;
}

export async function updateEquipamento(id, equip) {
    const collection = await getCollection('equipamentos');
    
    // Remove campos undefined, null e campos especiais do MongoDB
    const cleanEquip = Object.fromEntries(
        Object.entries(equip)
            .filter(([key, value]) => 
                value != null && 
                !['_id', 'id'].includes(key)
            )
    );

    const updateDoc = {
        ...cleanEquip,
        empresa_id: new ObjectId(cleanEquip.empresa_id),
        updated_at: new Date()
    };
    
    console.log('MongoDB update:', {
        id: id,
        updateDoc: updateDoc
    });

    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateDoc }
    );

    console.log('MongoDB result:', result);
    
    return await getEquipamentoById(id);
}

export async function deleteEquipamento(id) {
    const collection = await getCollection('equipamentos');
    await collection.deleteOne({ _id: new ObjectId(id) });
}

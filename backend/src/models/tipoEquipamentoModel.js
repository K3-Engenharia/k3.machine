import { getCollection } from './db.js';
import { ObjectId } from 'mongodb';

export async function getAllTiposEquipamento() {
    const collection = await getCollection('tipos_equipamento');
    const tipos = await collection.find().toArray();
    return tipos.map(tipo => ({
        ...tipo,
        id: tipo._id.toString()
    }));
}

export async function createTipoEquipamento(nome) {
    const collection = await getCollection('tipos_equipamento');
    const result = await collection.insertOne({
        nome,
        created_at: new Date()
    });
    return {
        id: result.insertedId.toString(),
        nome
    };
}

export async function updateTipoEquipamento(id, nome) {
    const collection = await getCollection('tipos_equipamento');
    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { nome } }
    );
    return { id, nome };
}

export async function deleteTipoEquipamento(id) {
    const collection = await getCollection('tipos_equipamento');
    await collection.deleteOne({ _id: new ObjectId(id) });
    return true;
}

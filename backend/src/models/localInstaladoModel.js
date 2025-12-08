import { getCollection } from './db.js';
import { ObjectId } from 'mongodb';

async function getAllLocaisInstalados(empresa_id) {
    const collection = await getCollection('locais_instalados');
    let query = {};
    
    if (empresa_id) {
        query.empresa_id = new ObjectId(empresa_id);
    }
    
    const locais = await collection.find(query).toArray();
    return locais.map(local => ({
        ...local,
        id: local._id.toString(),
        empresa_id: local.empresa_id.toString()
    }));
}

async function createLocalInstalado(nome, empresa_id) {
    const collection = await getCollection('locais_instalados');
    const localDoc = {
        nome,
        empresa_id: new ObjectId(empresa_id),
        created_at: new Date()
    };
    
    const result = await collection.insertOne(localDoc);
    return {
        id: result.insertedId.toString(),
        nome,
        empresa_id
    };
}

async function updateLocalInstalado(id, nome) {
    const collection = await getCollection('locais_instalados');
    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { nome } }
    );
    return { id, nome };
}

async function deleteLocalInstalado(id) {
    const collection = await getCollection('locais_instalados');
    await collection.deleteOne({ _id: new ObjectId(id) });
}

export default {
    getAllLocaisInstalados,
    createLocalInstalado,
    updateLocalInstalado,
    deleteLocalInstalado,
};

import { getCollection } from '../models/db.js';
import { ObjectId } from 'mongodb';

export async function createEmpresa(nome) {
    const collection = await getCollection('empresas');
    const result = await collection.insertOne({ nome });
    return { id: result.insertedId.toString(), nome };
}

export async function listEmpresas() {
    const collection = await getCollection('empresas');
    const empresas = await collection.find().sort({ nome: 1 }).toArray();
    return empresas.map(empresa => ({
        ...empresa,
        id: empresa._id.toString()
    }));
}

export async function getEmpresaById(id) {
    const collection = await getCollection('empresas');
    const empresa = await collection.findOne({ _id: new ObjectId(id) });
    if (empresa) {
        return {
            ...empresa,
            id: empresa._id.toString()
        };
    }
    return null;
}

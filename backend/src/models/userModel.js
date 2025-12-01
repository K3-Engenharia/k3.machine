import { getCollection } from './db.js';
import { ObjectId } from 'mongodb';

export async function createUser({ name, username, email, passwordHash, role, isApproved, empresas }) {
    const collection = await getCollection('users');
    
    const userDoc = {
        name,
        username,
        email,
        password_hash: passwordHash,
        role,
        is_approved: isApproved,
        empresas: Array.isArray(empresas) ? empresas.map(id => new ObjectId(id)) : [],
        created_at: new Date()
    };

    const result = await collection.insertOne(userDoc);
    return {
        id: result.insertedId.toString(),
        name,
        username,
        email,
        role,
        is_approved: isApproved,
        empresas: userDoc.empresas.map(id => id.toString())
    };
}

export async function findUserByUsername(username) {
    const collection = await getCollection('users');
    const user = await collection.findOne({ username });
    if (user) {
        return {
            ...user,
            id: user._id.toString(),
            empresas: user.empresas ? user.empresas.map(id => id.toString()) : []
        };
    }
    return null;
}

export async function findUserByEmail(email) {
    const collection = await getCollection('users');
    const user = await collection.findOne({ email });
    if (user) {
        return {
            ...user,
            id: user._id.toString(),
            empresas: user.empresas ? user.empresas.map(id => id.toString()) : []
        };
    }
    return null;
}

export async function approveUser(userId) {
    const collection = await getCollection('users');
    await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { is_approved: true } }
    );
    return getUserById(userId);
}

export async function getUserById(id) {
    const collection = await getCollection('users');
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (user) {
        return {
            ...user,
            id: user._id.toString(),
            empresas: user.empresas ? user.empresas.map(id => id.toString()) : []
        };
    }
    return null;
}

export async function deleteUserById(id) {
    const collection = await getCollection('users');
    await collection.deleteOne({ _id: new ObjectId(id) });
    return true;
}

export async function updateUserEmpresas(id, empresas) {
    const collection = await getCollection('users');
    const empresasIds = Array.isArray(empresas) ? empresas.map(id => new ObjectId(id)) : [];
    
    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { empresas: empresasIds } }
    );
    
    return getUserById(id);
}

export async function getEmpresasByUserId(user_id) {
    const user = await getUserById(user_id);
    return user ? (user.empresas || []) : [];
}

export async function updateUserPassword(id, passwordHash) {
    const collection = await getCollection('users');
    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { password_hash: passwordHash } }
    );
    return getUserById(id);
}

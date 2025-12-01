import { approveUser, findUserByEmail, getUserById, updateUserEmpresas, deleteUserById, updateUserPassword, createUser } from '../models/userModel.js';
import { sendApprovalEmail } from '../utils/mailer.js';
import { getCollection } from '../models/db.js';
import bcrypt from 'bcryptjs';

export async function approveUserById(req, res) {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    if (user.is_approved) return res.status(400).json({ message: 'Usuário já aprovado' });
    const updated = await approveUser(id);
    try {
        await sendApprovalEmail(updated.email, updated.name);
    } catch (e) {
        console.error('Erro ao enviar e-mail de aprovação:', e);
    }
    res.json({ message: 'Usuário aprovado com sucesso', user: updated });
}

export async function listAllUsers(req, res) {
    try {
        const collection = await getCollection('users');
        const users = await collection.find().toArray();
        res.json(users.map(user => ({
            ...user,
            id: user._id.toString(),
            empresas: user.empresas ? user.empresas.map(id => id.toString()) : []
        })));
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro ao listar usuários' });
    }
}

export async function setUserEmpresas(req, res) {
    const { id } = req.params;
    const { empresas } = req.body;
    if (!Array.isArray(empresas)) return res.status(400).json({ message: 'empresas obrigatórias (array)' });
    const user = await updateUserEmpresas(id, empresas);
    res.json(user);
}

export async function createUserWithEmpresas(req, res) {
    const { name, username, email, password, role, isApproved, empresas } = req.body;
    if (!name || !username || !email || !password || !role) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    }
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await createUser({ name, username, email, passwordHash, role, isApproved, empresas });
        res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
}

export async function deleteUser(req, res) {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    await deleteUserById(id);
    res.json({ message: 'Usuário excluído com sucesso' });
}

export async function changeUserPassword(req, res) {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Senha obrigatória' });
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    const passwordHash = await bcrypt.hash(password, 10);
    await updateUserPassword(id, passwordHash);
    res.json({ message: 'Senha alterada com sucesso' });
}

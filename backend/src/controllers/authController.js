import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername } from '../models/userModel.js';

export async function register(req, res) {
  const { name, username, email, password } = req.body;
  if (!name || !username || !password) return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' });
  // Verifica se username já existe
  const existing = await findUserByUsername(username);
  if (existing) return res.status(409).json({ message: 'Nome de usuário já cadastrado' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ name, username, email, passwordHash, role: 'tecnico', isApproved: false });
  res.status(201).json({ message: 'Usuário cadastrado. Aguarde aprovação do administrador.' });
}

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) return res.status(401).json({ message: 'Usuário ou senha inválidos' });
  if (!user.is_approved) return res.status(403).json({ message: 'Usuário não aprovado' });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: 'Usuário ou senha inválidos' });
  const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
}

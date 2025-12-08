import jwt from 'jsonwebtoken';
import { getEmpresasByUserId } from '../models/userModel.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    
    // Adiciona empresas vinculadas ao usuário (exceto admin)
    if (user.role !== 'admin') {
      try {
        user.empresas = await getEmpresasByUserId(user.id);
      } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar empresas do usuário' });
      }
    }
    
    req.user = user;
    next();
  });
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
}

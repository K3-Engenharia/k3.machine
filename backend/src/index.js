import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import dashboardRoutes from './routes/dashboard.js';
import equipamentosRoutes from './routes/equipamentos.js';
import empresasRoutes from './routes/empresas.js';
import tiposEquipamentoRoutes from './routes/tiposEquipamento.js';
import locaisInstaladosRoutes from './routes/locaisInstalados.js';
import { runMigrations } from './utils/runMigrations.js';

dotenv.config();

const app = express();

// Configurar CORS - Permitir todas as origens em produção
app.use(cors({
  origin: '*', // Permite todas as origens
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Aumentar limite para suportar imagens Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Servir arquivos estáticos da pasta uploads
app.use('/api/uploads', express.static('public/uploads'));

// Adiciona um header Content-Security-Policy flexível para desenvolvimento
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: *;"
  );
  next();
});

app.get('/', (req, res) => {
  res.send('K3 Machine API rodando!');
});

// Rota de health check para keep-alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/equipamentos', equipamentosRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/tipos-equipamento', tiposEquipamentoRoutes);
app.use('/api/locais-instalados', locaisInstaladosRoutes);

app.get('/api/debug/users', async (req, res) => {
  try {
    const { getCollection } = await import('./models/db.js');
    const collection = await getCollection('users');
    const users = await collection.find({}, { projection: { password_hash: 0 } }).toArray();
    res.json(users.map(user => ({
      ...user,
      id: user._id.toString(),
      empresas: user.empresas ? user.empresas.map(id => id.toString()) : []
    })));
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  
  // Erro do Multer
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: 'Erro no upload do arquivo',
      error: err.message
    });
  }

  // Outros erros
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 3001;
(async () => {
  try {
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro crítico ao iniciar servidor:', error);
    process.exit(1);
  }
})();

import { getDb } from '../models/db.js';

async function addEmpresaSupport() {
  const db = await getDb();
  // 1. Cria tabela empresas se não existir
  await db.run(`CREATE TABLE IF NOT EXISTS empresas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
  )`);
  // 2. Adiciona empresa_id em equipamentos
  try {
    await db.run('ALTER TABLE equipamentos ADD COLUMN empresa_id INTEGER');
    console.log('Coluna empresa_id adicionada em equipamentos.');
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('Coluna empresa_id já existe em equipamentos.');
    } else {
      console.error(e.message);
    }
  }
  // 3. Adiciona empresa_id em users
  try {
    await db.run('ALTER TABLE users ADD COLUMN empresa_id INTEGER');
    console.log('Coluna empresa_id adicionada em users.');
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('Coluna empresa_id já existe em users.');
    } else {
      console.error(e.message);
    }
  }
  process.exit();
}

addEmpresaSupport();

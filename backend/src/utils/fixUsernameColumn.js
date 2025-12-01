import { getDb } from '../models/db.js';

async function fixUsernameColumn() {
  const db = await getDb();
  try {
    // 1. Adiciona a coluna username sem UNIQUE
    await db.run('ALTER TABLE users ADD COLUMN username TEXT');
    console.log('Coluna username adicionada.');
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('A coluna username já existe.');
    } else {
      console.error('Erro ao adicionar coluna username:', e.message);
      process.exit(1);
    }
  }
  // 2. Preenche username do admin, se existir
  await db.run("UPDATE users SET username = 'admin' WHERE email = 'admin@empresa.com'");
  console.log('Username do admin atualizado para "admin".');
  // 3. (Opcional) Adicione UNIQUE depois, manualmente, se desejar
  process.exit();
}

fixUsernameColumn();

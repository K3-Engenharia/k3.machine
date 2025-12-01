import { getDb } from '../models/db.js';

async function main() {
  const db = await getDb();
  try {
    // 1. Adiciona a coluna username sem UNIQUE
    await db.run("ALTER TABLE users ADD COLUMN username TEXT");
    console.log('Coluna username adicionada.');
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('Coluna username já existe.');
    } else {
      console.error('Erro ao adicionar coluna username:', e.message);
      process.exit(1);
    }
  }
  // 2. Atualiza o admin para username 'admin' se existir
  await db.run("UPDATE users SET username = 'admin' WHERE email = 'admin@empresa.com'");
  // 3. (Opcional) Preencher outros usuários, se necessário
  // 4. (Opcional) Criar índice único
  try {
    await db.run("CREATE UNIQUE INDEX idx_users_username ON users(username)");
    console.log('Índice UNIQUE criado para username.');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('Índice UNIQUE já existe.');
    } else {
      console.error('Erro ao criar índice UNIQUE:', e.message);
    }
  }
  console.log('Processo concluído.');
  process.exit();
}

main();

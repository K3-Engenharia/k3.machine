
-- Tabela de relação N:N entre usuários e empresas
CREATE TABLE IF NOT EXISTS usuarios_empresas (
  user_id INTEGER,
  empresa_id INTEGER,
  PRIMARY KEY (user_id, empresa_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);
-- Criação da tabela de Locais Instalados
CREATE TABLE IF NOT EXISTS locais_instalados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  empresa_id INTEGER NOT NULL,
  UNIQUE(nome, empresa_id),
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);
-- Criação da tabela de usuários para SQLite
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'tecnico',
  is_approved INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de equipamentos
CREATE TABLE IF NOT EXISTS equipamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  modelo TEXT,
  fabricante TEXT,
  potencia REAL,
  corrente_nominal REAL,
  tensao_nominal REAL,
  local_instalado TEXT,
  tag_planta TEXT,
  data_instalacao TEXT,
  anexo TEXT,
  status TEXT DEFAULT 'Em Operação',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  rolamento TEXT
);

-- Criação da tabela de agendamentos de manutenção preventiva
CREATE TABLE IF NOT EXISTS agendamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipamento_id INTEGER NOT NULL,
  data_hora TEXT NOT NULL,
  tempo_estimado TEXT,
  responsavel TEXT,
  checklist TEXT,
  observacoes TEXT,
  periodicidade TEXT,
  proximo_agendamento TEXT,
  status TEXT DEFAULT 'Agendado',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id)
);

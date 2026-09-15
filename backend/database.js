const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT,
    email TEXT,
    cpf TEXT,
    endereco TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    descricao TEXT,
    preco REAL DEFAULT 0,
    quantidade INTEGER DEFAULT 0,
    estoque_minimo INTEGER DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ordens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    aparelho TEXT,
    marca TEXT,
    modelo TEXT,
    defeito TEXT,
    servico_realizado TEXT,
    pecas_utilizadas TEXT,
    valor REAL DEFAULT 0,
    status TEXT DEFAULT 'Aberta',
    data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_saida DATETIME
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    itens TEXT,
    valor_total REAL DEFAULT 0,
    forma_pagamento TEXT,
    data_venda DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS estoque_mov (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    tipo TEXT,
    quantidade INTEGER,
    observacao TEXT,
    data_mov DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS financeiro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT,
    descricao TEXT,
    valor REAL,
    referencia_tipo TEXT,
    referencia_id INTEGER,
    data_mov DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orcamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    descricao TEXT,
    itens TEXT,
    valor_total REAL DEFAULT 0,
    status TEXT DEFAULT 'Pendente',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;

const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all('SELECT * FROM produtos ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { nome, tipo, descricao, preco, quantidade, estoque_minimo } = req.body;
  db.run(
    'INSERT INTO produtos (nome, tipo, descricao, preco, quantidade, estoque_minimo) VALUES (?,?,?,?,?,?)',
    [nome, tipo, descricao, preco, quantidade || 0, estoque_minimo || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

router.put('/:id', (req, res) => {
  const { nome, tipo, descricao, preco, quantidade, estoque_minimo } = req.body;
  db.run(
    'UPDATE produtos SET nome=?, tipo=?, descricao=?, preco=?, quantidade=?, estoque_minimo=? WHERE id=?',
    [nome, tipo, descricao, preco, quantidade, estoque_minimo, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ atualizado: this.changes });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM produtos WHERE id=?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deletado: this.changes });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all(
    `SELECT o.*, c.nome as cliente_nome FROM ordens o
     LEFT JOIN clientes c ON c.id = o.cliente_id
     ORDER BY o.id DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

router.post('/', (req, res) => {
  const { cliente_id, aparelho, marca, modelo, defeito, servico_realizado, pecas_utilizadas, valor, status } = req.body;
  db.run(
    `INSERT INTO ordens (cliente_id, aparelho, marca, modelo, defeito, servico_realizado, pecas_utilizadas, valor, status)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [cliente_id, aparelho, marca, modelo, defeito, servico_realizado, pecas_utilizadas, valor, status || 'Aberta'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

router.put('/:id', (req, res) => {
  const { cliente_id, aparelho, marca, modelo, defeito, servico_realizado, pecas_utilizadas, valor, status } = req.body;
  db.run(
    `UPDATE ordens SET cliente_id=?, aparelho=?, marca=?, modelo=?, defeito=?, servico_realizado=?, pecas_utilizadas=?, valor=?, status=? WHERE id=?`,
    [cliente_id, aparelho, marca, modelo, defeito, servico_realizado, pecas_utilizadas, valor, status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ atualizado: this.changes });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM ordens WHERE id=?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deletado: this.changes });
  });
});

module.exports = router;

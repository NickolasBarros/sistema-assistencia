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
      const ordemId = this.lastID;

      // Se já criou como "Entregue", lança no financeiro
      if (status === 'Entregue' && valor > 0) {
        db.run(
          `INSERT INTO financeiro (tipo, descricao, valor, referencia_tipo, referencia_id) VALUES (?,?,?,?,?)`,
          ['receita', 'Ordem de Serviço #' + ordemId, valor, 'ordem', ordemId]
        );
      }

      res.json({ id: ordemId });
    }
  );
});

router.put('/:id', (req, res) => {
  const { cliente_id, aparelho, marca, modelo, defeito, servico_realizado, pecas_utilizadas, valor, status } = req.body;
  const ordemId = req.params.id;

  // Busca o status antigo antes de atualizar
  db.get('SELECT status, valor FROM ordens WHERE id=?', [ordemId], (err, antiga) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!antiga) return res.status(404).json({ error: 'Ordem não encontrada' });

    const statusAntigo = antiga.status;

    db.run(
      `UPDATE ordens SET cliente_id=?, aparelho=?, marca=?, modelo=?, defeito=?, servico_realizado=?, pecas_utilizadas=?, valor=?, status=? WHERE id=?`,
      [cliente_id, aparelho, marca, modelo, defeito, servico_realizado, pecas_utilizadas, valor, status, ordemId],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });

        // Se MUDOU para "Entregue" e ainda não tinha lançamento, cria
        if (status === 'Entregue' && statusAntigo !== 'Entregue' && valor > 0) {
          db.get(
            `SELECT id FROM financeiro WHERE referencia_tipo='ordem' AND referencia_id=?`,
            [ordemId],
            (err3, existente) => {
              if (!existente) {
                db.run(
                  `INSERT INTO financeiro (tipo, descricao, valor, referencia_tipo, referencia_id) VALUES (?,?,?,?,?)`,
                  ['receita', 'Ordem de Serviço #' + ordemId, valor, 'ordem', ordemId]
                );
              }
            }
          );
        }

        // Se estava "Entregue" e mudou para outro status, REMOVE o lançamento
        if (statusAntigo === 'Entregue' && status !== 'Entregue') {
          db.run(
            `DELETE FROM financeiro WHERE referencia_tipo='ordem' AND referencia_id=?`,
            [ordemId]
          );
        }

        // Se continua "Entregue" mas o valor mudou, ATUALIZA o lançamento
        if (status === 'Entregue' && statusAntigo === 'Entregue' && valor !== antiga.valor) {
          db.run(
            `UPDATE financeiro SET valor=? WHERE referencia_tipo='ordem' AND referencia_id=?`,
            [valor, ordemId]
          );
        }

        res.json({ atualizado: this.changes });
      }
    );
  });
});

router.delete('/:id', (req, res) => {
  const ordemId = req.params.id;
  // Remove também o lançamento financeiro vinculado
  db.run('DELETE FROM financeiro WHERE referencia_tipo=? AND referencia_id=?', ['ordem', ordemId]);
  db.run('DELETE FROM ordens WHERE id=?', [ordemId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deletado: this.changes });
  });
});

module.exports = router;

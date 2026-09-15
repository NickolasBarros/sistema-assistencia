const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/resumo', (req, res) => {
  const result = {};

  db.get('SELECT COUNT(*) as total FROM clientes', [], (e1, r1) => {
    result.clientes = r1?.total || 0;

    db.get("SELECT COUNT(*) as total FROM ordens WHERE status != 'Entregue'", [], (e2, r2) => {
      result.ordens_abertas = r2?.total || 0;

      db.get('SELECT COUNT(*) as total FROM ordens', [], (e3, r3) => {
        result.ordens_total = r3?.total || 0;

        db.get("SELECT COALESCE(SUM(valor_total),0) as total FROM vendas", [], (e4, r4) => {
          result.vendas_total = r4?.total || 0;

          db.get(
            "SELECT COALESCE(SUM(CASE WHEN tipo='receita' THEN valor ELSE 0 END),0) as receitas, COALESCE(SUM(CASE WHEN tipo='despesa' THEN valor ELSE 0 END),0) as despesas FROM financeiro",
            [],
            (e5, r5) => {
              result.receitas = r5?.receitas || 0;
              result.despesas = r5?.despesas || 0;
              result.saldo = (r5?.receitas || 0) - (r5?.despesas || 0);

              db.all(
                'SELECT id, nome, quantidade, estoque_minimo FROM produtos WHERE tipo=? AND quantidade <= estoque_minimo',
                ['produto'],
                (e6, r6) => {
                  result.estoque_baixo = r6 || [];
                  res.json(result);
                }
              );
            }
          );
        });
      });
    });
  });
});

module.exports = router;

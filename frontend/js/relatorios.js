async function carregarRelatorios() {
  const r = await apiGet('/relatorios/resumo');
  document.getElementById('rel-clientes').textContent = r.clientes;
  document.getElementById('rel-ordens').textContent = r.ordens_total;
  document.getElementById('rel-receitas').textContent = formatMoney(r.receitas);
  document.getElementById('rel-despesas').textContent = formatMoney(r.despesas);
  document.getElementById('rel-saldo').textContent = formatMoney(r.saldo);
}

async function carregarDashboard() {
  const r = await apiGet('/relatorios/resumo');
  document.getElementById('kpi-clientes').textContent = r.clientes;
  document.getElementById('kpi-ordens').textContent = r.ordens_abertas;
  document.getElementById('kpi-vendas').textContent = formatMoney(r.vendas_total);
  document.getElementById('kpi-saldo').textContent = formatMoney(r.saldo);

  const div = document.getElementById('lista-estoque-baixo');
  if (!r.estoque_baixo.length) {
    div.innerHTML = '<div class="vazio">Nenhum produto com estoque baixo</div>';
  } else {
    div.innerHTML = r.estoque_baixo.map(p =>
      `<div class="item">⚠️ <strong>${p.nome}</strong> — Qtd: ${p.quantidade} (mín: ${p.estoque_minimo})</div>`
    ).join('');
  }
}

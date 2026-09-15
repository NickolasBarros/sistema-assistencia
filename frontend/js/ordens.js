async function carregarOrdens() {
  const lista = await apiGet('/ordens');
  const tbody = document.querySelector('#tabela-ordens tbody');
  tbody.innerHTML = '';
  lista.forEach(o => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.cliente_nome || '-'}</td>
      <td>${o.aparelho || '-'} ${o.marca ? '| ' + o.marca : ''} ${o.modelo ? '| ' + o.modelo : ''}</td>
      <td><span class="badge">${o.status}</span></td>
      <td>${formatMoney(o.valor)}</td>
      <td>
        <button class="edit" onclick="editarOrdem(${o.id})">Editar</button>
        <button onclick="excluirOrdem(${o.id})">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function editarOrdem(id) {
  const lista = await apiGet('/ordens');
  const o = lista.find(x => x.id === id);
  if (!o) return;
  document.getElementById('ordem-id').value = o.id;
  document.getElementById('ordem-cliente').value = o.cliente_id || '';
  document.getElementById('ordem-aparelho').value = o.aparelho || '';
  document.getElementById('ordem-marca').value = o.marca || '';
  document.getElementById('ordem-modelo').value = o.modelo || '';
  document.getElementById('ordem-defeito').value = o.defeito || '';
  document.getElementById('ordem-servico').value = o.servico_realizado || '';
  document.getElementById('ordem-pecas').value = o.pecas_utilizadas || '';
  document.getElementById('ordem-valor').value = o.valor || 0;
  document.getElementById('ordem-status').value = o.status || 'Aberta';
  document.getElementById('cancel-ordem').style.display = 'inline-block';
}

async function excluirOrdem(id) {
  if (!confirm('Excluir ordem?')) return;
  await apiDelete('/ordens/' + id);
  carregarOrdens();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form-ordem').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('ordem-id').value;
    const dados = {
      cliente_id: parseInt(document.getElementById('ordem-cliente').value) || null,
      aparelho: document.getElementById('ordem-aparelho').value,
      marca: document.getElementById('ordem-marca').value,
      modelo: document.getElementById('ordem-modelo').value,
      defeito: document.getElementById('ordem-defeito').value,
      servico_realizado: document.getElementById('ordem-servico').value,
      pecas_utilizadas: document.getElementById('ordem-pecas').value,
      valor: parseFloat(document.getElementById('ordem-valor').value) || 0,
      status: document.getElementById('ordem-status').value
    };
    if (id) await apiPut('/ordens/' + id, dados);
    else await apiPost('/ordens', dados);
    e.target.reset();
    document.getElementById('ordem-id').value = '';
    document.getElementById('cancel-ordem').style.display = 'none';
    carregarOrdens();
  });

  document.getElementById('cancel-ordem').addEventListener('click', () => {
    document.getElementById('form-ordem').reset();
    document.getElementById('ordem-id').value = '';
    document.getElementById('cancel-ordem').style.display = 'none';
  });
});

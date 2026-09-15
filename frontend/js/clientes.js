async function carregarClientes() {
  const lista = await apiGet('/clientes');
  const tbody = document.querySelector('#tabela-clientes tbody');
  tbody.innerHTML = '';
  lista.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.nome}</td>
      <td>${c.telefone || '-'}</td>
      <td>${c.email || '-'}</td>
      <td>
        <button class="edit" onclick="editarCliente(${c.id})">Editar</button>
        <button onclick="excluirCliente(${c.id})">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  });
  await atualizarSelectsClientes();
}

async function editarCliente(id) {
  const c = await apiGet('/clientes/' + id);
  document.getElementById('cliente-id').value = c.id;
  document.getElementById('cliente-nome').value = c.nome || '';
  document.getElementById('cliente-telefone').value = c.telefone || '';
  document.getElementById('cliente-email').value = c.email || '';
  document.getElementById('cliente-cpf').value = c.cpf || '';
  document.getElementById('cliente-endereco').value = c.endereco || '';
  document.getElementById('cancel-cliente').style.display = 'inline-block';
}

async function excluirCliente(id) {
  if (!confirm('Excluir cliente?')) return;
  await apiDelete('/clientes/' + id);
  carregarClientes();
}

async function atualizarSelectsClientes() {
  const lista = await apiGet('/clientes');
  const selects = ['ordem-cliente', 'orcamento-cliente', 'venda-cliente'];
  selects.forEach(sid => {
    const sel = document.getElementById(sid);
    if (!sel) return;
    const val = sel.value;
    sel.innerHTML = '<option value="">Selecione o cliente...</option>';
    lista.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.nome;
      sel.appendChild(opt);
    });
    sel.value = val;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form-cliente').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cliente-id').value;
    const dados = {
      nome: document.getElementById('cliente-nome').value,
      telefone: document.getElementById('cliente-telefone').value,
      email: document.getElementById('cliente-email').value,
      cpf: document.getElementById('cliente-cpf').value,
      endereco: document.getElementById('cliente-endereco').value
    };
    if (id) await apiPut('/clientes/' + id, dados);
    else await apiPost('/clientes', dados);
    e.target.reset();
    document.getElementById('cliente-id').value = '';
    document.getElementById('cancel-cliente').style.display = 'none';
    carregarClientes();
  });

  document.getElementById('cancel-cliente').addEventListener('click', () => {
    document.getElementById('form-cliente').reset();
    document.getElementById('cliente-id').value = '';
    document.getElementById('cancel-cliente').style.display = 'none';
  });
});

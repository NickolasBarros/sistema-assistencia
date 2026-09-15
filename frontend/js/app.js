const titulos = {
  dashboard: 'Dashboard',
  clientes: 'Clientes',
  produtos: 'Produtos e Serviços',
  ordens: 'Ordens de Serviço',
  kanban: 'Kanban de Reparos',
  orcamentos: 'Orçamentos',
  vendas: 'Vendas',
  estoque: 'Estoque',
  financeiro: 'Financeiro',
  relatorios: 'Relatórios'
};

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    document.getElementById('view-' + view).classList.add('active');
    document.getElementById('page-title').textContent = titulos[view];

    if (view === 'dashboard') carregarDashboard();
    if (view === 'clientes') carregarClientes();
    if (view === 'produtos') carregarProdutos();
    if (view === 'ordens') carregarOrdens();
    if (view === 'kanban') carregarKanban();
    if (view === 'orcamentos') carregarOrcamentos();
    if (view === 'vendas') carregarVendas();
    if (view === 'estoque') carregarEstoque();
    if (view === 'financeiro') carregarFinanceiro();
    if (view === 'relatorios') carregarRelatorios();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  carregarDashboard();
});

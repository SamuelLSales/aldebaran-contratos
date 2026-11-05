import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NOME = 'ProjectSight';

const contratosDemo = [
  {
    codigo: 'CT-2026/014',
    projeto: 'Mapeamento Topográfico e Georreferenciamento Igaratinga',
    cliente: 'Exbel Mineração S.A.',
    area: 'Topografia',
    dot: 'bg-sky-500',
    diretor: 'Robson Ribeiro',
    entrega: '21/11/2026',
    restante: '18 dias',
    status: 'No prazo',
    statusStyle: 'bg-emerald-50 text-emerald-800',
    statusDot: 'bg-status-success',
    progresso: 63,
    barColor: 'bg-status-success',
    fases: [
      { nome: 'Fase 1 · Planejamento e Mobilização', resp: 'Humberto Silva', inicio: '01/10', fim: '10/10', avanco: 100 },
      { nome: 'Fase 2 · Levantamento Planialtimétrico de Campo', resp: 'Carlos Eduardo', inicio: '11/10', fim: '05/11', avanco: 75 },
      { nome: 'Fase 3 · Processamento GNSS e Peças Técnicas', resp: 'Humberto Silva', inicio: '06/11', fim: '21/11', avanco: 20 },
    ],
  },
  {
    codigo: 'CT-2026/019',
    projeto: 'Sondagem Rotativa e Modelagem Geológica 3D Serra Azul',
    cliente: 'Mineração Morro do Ipê',
    area: 'Geologia',
    dot: 'bg-amber-500',
    diretor: 'Mariana Lopes',
    entrega: '08/11/2026',
    restante: '5 dias',
    status: 'Atenção',
    statusStyle: 'bg-amber-50 text-amber-800',
    statusDot: 'bg-status-warning',
    progresso: 78,
    barColor: 'bg-status-warning',
    fases: [
      { nome: 'Fase 1 · Locação de Furos e Sondagem', resp: 'Mariana Lopes', inicio: '15/09', fim: '15/10', avanco: 100 },
      { nome: 'Fase 2 · Descrição Litológica e Amostragem', resp: 'Mariana Lopes', inicio: '16/10', fim: '28/10', avanco: 100 },
      { nome: 'Fase 3 · Modelagem 3D e Relatório Final', resp: 'Robson Ribeiro', inicio: '29/10', fim: '08/11', avanco: 35 },
    ],
  },
  {
    codigo: 'CT-2026/011',
    projeto: 'Levantamento Planialtimétrico Cadastral Nova Lima',
    cliente: 'Construtora Caparaó',
    area: 'Topografia',
    dot: 'bg-sky-500',
    diretor: 'Robson Ribeiro',
    entrega: '24/10/2026',
    restante: 'Atrasado há 10d',
    status: 'Atrasado',
    statusStyle: 'bg-red-50 text-red-800',
    statusDot: 'bg-status-danger',
    progresso: 40,
    barColor: 'bg-status-danger',
    fases: [
      { nome: 'Fase 1 · Implantação de Marcos Geodésicos', resp: 'Humberto Silva', inicio: '01/10', fim: '08/10', avanco: 100 },
      { nome: 'Fase 2 · Cadastro de Interferências e Drenagem', resp: 'Carlos Eduardo', inicio: '09/10', fim: '18/10', avanco: 20 },
      { nome: 'Fase 3 · Desenho Técnico Topográfico (MDT)', resp: 'Carlos Eduardo', inicio: '19/10', fim: '24/10', avanco: 0 },
    ],
  },
  {
    codigo: 'CT-2026/022',
    projeto: 'Plano de Controle Ambiental (PCA) e Caracterização Florística',
    cliente: 'Votorantim Cimentos S.A.',
    area: 'Meio Ambiente',
    dot: 'bg-emerald-500',
    diretor: 'Letícia Fontes',
    entrega: '04/12/2026',
    restante: '31 dias',
    status: 'No prazo',
    statusStyle: 'bg-emerald-50 text-emerald-800',
    statusDot: 'bg-status-success',
    progresso: 63,
    barColor: 'bg-status-success',
    fases: [
      { nome: 'Fase 1 · Diagnóstico Ambiental e Campanhas', resp: 'Letícia Fontes', inicio: '10/10', fim: '30/10', avanco: 100 },
      { nome: 'Fase 2 · Inventário Florestal e Laudos', resp: 'Letícia Fontes', inicio: '01/11', fim: '20/11', avanco: 60 },
      { nome: 'Fase 3 · Consolidação do PCA e Protocolo', resp: 'Nadia Souza', inicio: '21/11', fim: '04/12', avanco: 30 },
    ],
  },
];

/**
 * Demonstração interativa e em largura real da interface do ProjectSight.
 * Permite clicar em qualquer contrato da tabela para inspecionar suas fases logo abaixo.
 */
const InteractiveWorkspacePreview = () => {
  const [selecionado, setSelecionado] = useState(0);
  const [filtroArea, setFiltroArea] = useState('Todas');

  const lista = filtroArea === 'Todas'
    ? contratosDemo
    : contratosDemo.filter((c) => c.area === filtroArea);

  const contratoAtivo = contratosDemo[selecionado] || contratosDemo[0];

  return (
    <div className="rounded-xl bg-slate-900/5 p-2 ring-1 ring-slate-900/10 shadow-2xl">
      <div className="bg-card rounded-lg border border-slate-200/90 overflow-hidden text-slate-900">
        {/* Topbar real do sistema */}
        <div className="h-12 px-4 lg:px-6 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-sm tracking-tight text-slate-900">
              {NOME}
            </span>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
              <span>Painel</span>
              <span>/</span>
              <span className="text-slate-700 font-medium">Controle Operacional de Contratos</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-600">
              Exportar CSV
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-primary text-white text-[11px] font-medium">
              + Novo contrato
            </span>
          </div>
        </div>

        {/* Faixa de indicadores em grade arquitetônica */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-b border-slate-200 bg-slate-50/50">
          {[
            { label: 'Contratos ativos', valor: '04', nota: 'em execução', cor: 'text-slate-900' },
            { label: 'No prazo', valor: '02', nota: 'cronograma regular', cor: 'text-slate-900', dot: 'bg-status-success' },
            { label: 'Atenção (≤ 7 dias)', valor: '01', nota: 'entrega próxima', cor: 'text-status-warning', dot: 'bg-status-warning' },
            { label: 'Em atraso', valor: '01', nota: 'prazo ultrapassado', cor: 'text-status-danger', dot: 'bg-status-danger' },
          ].map((k) => (
            <div key={k.label} className="px-5 py-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{k.label}</span>
                {k.dot && <span className={`w-2 h-2 rounded-full ${k.dot}`} />}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className={`text-2xl font-semibold tracking-tight tabular-nums ${k.cor}`}>{k.valor}</span>
                <span className="text-[11px] text-slate-400">{k.nota}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de filtro funcional na prévia */}
        <div className="px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-1">
            {['Todas', 'Topografia', 'Geologia', 'Meio Ambiente'].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setFiltroArea(a)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  filtroArea === a
                    ? 'bg-primary text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400">
            Clique em um contrato abaixo para inspecionar o desdobramento de fases
          </span>
        </div>

        {/* Tabela de contratos com nomes completos */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-5">Código</th>
                <th className="py-2.5 px-4">Contrato / Cliente</th>
                <th className="py-2.5 px-4">Frente Técnica</th>
                <th className="py-2.5 px-4 hidden md:table-cell">Responsável</th>
                <th className="py-2.5 px-4 hidden sm:table-cell">Entrega</th>
                <th className="py-2.5 px-4">Situação</th>
                <th className="py-2.5 px-5 text-right">Avanço</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {lista.map((c) => {
                const idxOriginal = contratosDemo.findIndex((item) => item.codigo === c.codigo);
                const ativo = idxOriginal === selecionado;
                return (
                  <tr
                    key={c.codigo}
                    onClick={() => setSelecionado(idxOriginal)}
                    className={`cursor-pointer transition-colors ${
                      ativo ? 'bg-primary-light/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-5 font-mono text-xs text-slate-500 whitespace-nowrap">{c.codigo}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900 text-xs sm:text-sm">{c.projeto}</p>
                      <p className="text-xs text-slate-500">{c.cliente}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2 text-xs text-slate-700">
                        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                        {c.area}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 hidden md:table-cell whitespace-nowrap">
                      {c.diretor}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 hidden sm:table-cell whitespace-nowrap">
                      {c.entrega}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${c.statusStyle}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.statusDot}`} />
                        {c.restante}
                      </span>
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${c.barColor}`} style={{ width: `${c.progresso}%` }} />
                        </div>
                        <span className="font-mono text-xs text-slate-700 w-8 text-right tabular-nums">{c.progresso}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Painel inferior: Inspecionador de Fases do Contrato Selecionado */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded">
                {contratoAtivo.codigo}
              </span>
              <span className="text-xs font-semibold text-slate-800">
                Cronograma de Fases — {contratoAtivo.projeto}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Diretor: <strong className="font-medium text-slate-700">{contratoAtivo.diretor}</strong>
            </span>
          </div>

          <div className="mt-3 grid md:grid-cols-3 gap-3">
            {contratoAtivo.fases.map((f) => (
              <div key={f.nome} className="bg-white border border-slate-200/90 rounded-md p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-800 truncate">{f.nome}</span>
                  <span className="font-mono text-[11px] font-semibold text-slate-600 tabular-nums">{f.avanco}%</span>
                </div>
                <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      f.avanco === 100 ? 'bg-status-success' : f.avanco > 0 ? 'bg-accent' : 'bg-slate-300'
                    }`}
                    style={{ width: `${f.avanco}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{f.resp}</span>
                  <span className="font-mono">{f.inicio} → {f.fim}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Landing = () => (
  <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
    {/* TOPBAR FIXA E ESTRUTURADA */}
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/projectsight" className="text-base font-bold tracking-tight text-slate-900">
          Project<span className="text-primary">Sight</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600" aria-label="Seções">
          <a href="#visao-geral" className="hover:text-slate-900 transition-colors">
            Visão geral
          </a>
          <a href="#arquitetura" className="hover:text-slate-900 transition-colors">
            Estrutura de controle
          </a>
          <a href="#prazos" className="hover:text-slate-900 transition-colors">
            Regras de prazo
          </a>
          <a href="#frentes" className="hover:text-slate-900 transition-colors">
            Frentes técnicas
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="h-9 px-4 inline-flex items-center rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors shadow-2xs"
          >
            Entrar no sistema
          </Link>
        </div>
      </div>
    </header>

    {/* HERO EDITORIAL + WORKSPACE INTERATIVO EM LARGURA REAL */}
    <section id="visao-geral" className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/80">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.12]">
            Acompanhamento técnico de contratos, fases operacionais e prazos de entrega.
          </h1>

          <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-2xl">
            O {NOME} centraliza o cronograma de projetos de Topografia, Geologia e Meio Ambiente. Cada contrato é controlado por fases, etapas e responsáveis, com cálculo automático de vencimentos e histórico de alterações.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/login"
              className="h-11 px-6 inline-flex items-center rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors shadow-xs"
            >
              Acessar painel de contratos
            </Link>
            <a
              href="#arquitetura"
              className="h-11 px-5 inline-flex items-center rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Explorar como funciona
            </a>
          </div>
        </div>

        {/* Workspace interativo de ponta a ponta */}
        <div className="mt-12">
          <InteractiveWorkspacePreview />
        </div>
      </div>
    </section>

    {/* ESTRUTURA DE CONTROLE — GRADE ARQUITETÔNICA */}
    <section id="arquitetura" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Como o sistema organiza a operação
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Em vez de planilhas paralelas, os dados ficam estruturados em três níveis hierárquicos conectados à equipe técnica e ao registro de auditoria.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-400">
          CONTRATO → FASES → ETAPAS
        </span>
      </div>

      {/* Grade contínua */}
      <div className="grid md:grid-cols-3 border border-slate-200 rounded-xl bg-card divide-y md:divide-y-0 md:divide-x divide-slate-200 shadow-card overflow-hidden">
        <div className="p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>NÍVEL 01</span>
              <span>ESCOPO & PRAZO MACRO</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Registro do contrato</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Reúne os dados contratuais do projeto: cliente, frente técnica, diretor responsável, direitos minerários, dias previstos de campo e data limite de entrega.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Progresso ponderado automático</span>
            <span className="font-mono text-slate-700 font-medium">0% → 100%</span>
          </div>
        </div>

        <div className="p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>NÍVEL 02</span>
              <span>MACROETAPAS</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Divisão em fases</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Cada contrato pode ser estruturado em quantas fases forem necessárias (mobilização, levantamento de campo, processamento, relatório final), mantendo a ordem cronológica.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Visão recolhível por fase</span>
            <span className="font-mono text-slate-700 font-medium">Ordem sequencial</span>
          </div>
        </div>

        <div className="p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>NÍVEL 03</span>
              <span>EXECUÇÃO TÉCNICA</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Etapas e responsáveis</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Dentro de cada fase ficam as tarefas operacionais com profissional nominalmente atribuído, datas de início e término, observações técnicas e controle de avanço.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Atualização direta por barra/slider</span>
            <span className="font-mono text-slate-700 font-medium">Por colaborador</span>
          </div>
        </div>
      </div>

      {/* Segunda linha de especificações funcionais */}
      <div className="mt-5 grid md:grid-cols-3 gap-5">
        <div className="bg-card border border-slate-200 rounded-xl p-6 shadow-card">
          <h3 className="text-base font-semibold text-slate-900">Quadro de equipe e alocação</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Lista todos os profissionais por função (Diretor, Coordenador, Campo, Escritório) e contabiliza automaticamente em quantos contratos ativos cada pessoa está envolvida.
          </p>
        </div>

        <div className="bg-card border border-slate-200 rounded-xl p-6 shadow-card">
          <h3 className="text-base font-semibold text-slate-900">Análise de gargalos e prazos</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Aba analítica dedicada no painel principal para identificar rapidamente quais fases concentram atrasos e quais contratos vencem na semana corrente.
          </p>
        </div>

        <div className="bg-card border border-slate-200 rounded-xl p-6 shadow-card">
          <h3 className="text-base font-semibold text-slate-900">Rastreabilidade e exportação CSV</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Log cronológico de todas as alterações feitas no contrato e exportação imediata da listagem completa em formato CSV para análises externas.
          </p>
        </div>
      </div>
    </section>

    {/* REGRAS DE PRAZO E CLASSIFICAÇÃO */}
    <section id="prazos" className="bg-card border-y border-slate-200 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Critérios objetivos de status e alerta
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            A situação de cada contrato não depende de preenchimento subjetivo: ela é calculada pela relação entre a data atual, a data de entrega final e o percentual concluído.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 bg-background">
            {[
              {
                status: 'No prazo',
                badge: 'bg-emerald-50 text-emerald-800',
                dot: 'bg-status-success',
                condicao: 'Mais de 7 dias até a data de entrega',
                descricao: 'Cronograma em andamento normal, sem alerta de vencimento iminente.',
              },
              {
                status: 'Atenção',
                badge: 'bg-amber-50 text-amber-800',
                dot: 'bg-status-warning',
                condicao: 'Entre 1 e 7 dias restantes',
                descricao: 'Contrato entra na faixa de prioridade semanal para fechamento das etapas pendentes.',
              },
              {
                status: 'Atrasado',
                badge: 'bg-red-50 text-red-800',
                dot: 'bg-status-danger',
                descricao: 'Data final ultrapassada sem 100% de conclusão. Destacado no topo do painel executivo.',
                condicao: 'Prazo final vencido (< 0 dias)',
              },
              {
                status: 'Concluído',
                badge: 'bg-slate-100 text-slate-700',
                dot: 'bg-status-done',
                condicao: '100% das etapas finalizadas',
                descricao: 'Contrato encerrado, mantido no histórico para consulta e relatórios.',
              },
            ].map((item) => (
              <div key={item.status} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${item.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                      {item.status}
                    </span>
                    <span className="font-mono text-xs text-slate-500">{item.condicao}</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* FRENTES TÉCNICAS */}
    <section id="frentes" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-16">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Frentes técnicas atendidas</h2>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Navegação segmentada por disciplina para acompanhamento específico de cada área operacional.
        </p>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {[
          {
            sigla: '01 · TOPOGRAFIA',
            titulo: 'Topografia e Cartografia',
            dot: 'bg-sky-500',
            escopo: 'Levantamentos planialtimétricos, cadastrais, georreferenciamento de imóveis e apoio topográfico de campo.',
            itens: ['Implantação de marcos e poligonais', 'Aerofotogrametria e MDT', 'Memoriais descritivos e plantas'],
          },
          {
            sigla: '02 · GEOLOGIA',
            titulo: 'Geologia e Sondagem',
            dot: 'bg-amber-500',
            escopo: 'Campanhas de exploração, acompanhamento de sondagem rotativa/percussiva, mapeamento e modelagem geológica.',
            itens: ['Locação e acompanhamento de furos', 'Descrição litológica e geotécnica', 'Modelagem 3D e cubagem'],
          },
          {
            sigla: '03 · MEIO AMBIENTE',
            titulo: 'Estudos Ambientais',
            dot: 'bg-emerald-500',
            escopo: 'Elaboração de estudos, licenciamentos, planos de controle ambiental e monitoramento de condicionantes.',
            itens: ['Plano de Controle Ambiental (PCA)', 'Caracterização florística e inventário', 'Relatórios técnicos de acompanhamento'],
          },
        ].map((f) => (
          <div key={f.sigla} className="bg-card border border-slate-200 rounded-xl p-6 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-slate-400">{f.sigla}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${f.dot}`} />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{f.titulo}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.escopo}</p>
            </div>

            <ul className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              {f.itens.map((it) => (
                <li key={it} className="text-xs text-slate-600 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    {/* RODAPÉ E ACESSO DIRETO */}
    <footer className="border-t border-slate-200 bg-card">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Project<span className="text-primary">Sight</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Sistema de Controle de Contratos, Cronogramas e Prazos</p>
        </div>

        <Link
          to="/login"
          className="h-10 px-5 inline-flex items-center rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Acessar o sistema
        </Link>
      </div>
    </footer>
  </div>
);

export default Landing;

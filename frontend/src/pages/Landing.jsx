import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NOME = 'ProjectSight';

const contratosDemo = [
  {
    codigo: 'CT-2026/014',
    projeto: 'Mapeamento Topográfico e Georreferenciamento Igaratinga',
    cliente: 'Exbel Mineração S.A.',
    area: 'Topografia',
    dot: 'bg-[#266DF0]',
    diretor: 'Robson Ribeiro',
    entrega: '21/11/2026',
    restante: '18 dias',
    status: 'No prazo',
    statusStyle: 'bg-[#EAFBF1] text-[#0E7138] border border-[#C6F0D8]',
    statusDot: 'bg-[#12A150]',
    progresso: 63,
    barColor: 'bg-[#266DF0]',
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
    dot: 'bg-[#36383D]',
    diretor: 'Mariana Lopes',
    entrega: '08/11/2026',
    restante: '5 dias',
    status: 'Atenção',
    statusStyle: 'bg-[#FFF6E5] text-[#945300] border border-[#FDE2B3]',
    statusDot: 'bg-[#E08600]',
    progresso: 78,
    barColor: 'bg-[#266DF0]',
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
    dot: 'bg-[#266DF0]',
    diretor: 'Robson Ribeiro',
    entrega: '24/10/2026',
    restante: 'Atrasado há 10d',
    status: 'Atrasado',
    statusStyle: 'bg-[#FFF0EE] text-[#B42318] border border-[#FFD4CE]',
    statusDot: 'bg-[#E5392D]',
    progresso: 40,
    barColor: 'bg-[#E5392D]',
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
    dot: 'bg-[#12A150]',
    diretor: 'Letícia Fontes',
    entrega: '04/12/2026',
    restante: '31 dias',
    status: 'No prazo',
    statusStyle: 'bg-[#EAFBF1] text-[#0E7138] border border-[#C6F0D8]',
    statusDot: 'bg-[#12A150]',
    progresso: 63,
    barColor: 'bg-[#266DF0]',
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
            { label: 'No prazo', valor: '02', nota: 'cronograma regular', cor: 'text-slate-900', dot: 'bg-[#2b2b27]' },
            { label: 'Atenção (≤ 7 dias)', valor: '01', nota: 'entrega próxima', cor: 'text-slate-900', dot: 'bg-[#b43310]' },
            { label: 'Em atraso', valor: '01', nota: 'prazo ultrapassado', cor: 'text-primary', dot: 'bg-primary' },
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


/* Rótulo pequeno em caixa alta com espaçamento largo (microtipografia editorial) */
const Eyebrow = ({ children }) => (
  <span className="font-display text-[11px] font-medium uppercase tracking-[0.28em] text-[#8A8F98]">
    {children}
  </span>
);

const Landing = () => (
  <div className="min-h-screen bg-[#0B0C0E] text-[#F2F3F5] font-sans selection:bg-[#266DF0] selection:text-white">
    {/* TOPBAR MINIMALISTA */}
    <header className="absolute top-0 inset-x-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/projectsight" className="font-display text-sm font-bold tracking-[0.18em] uppercase text-white">
          PS
        </Link>

        <nav className="flex items-center gap-8" aria-label="Navegação">
          <a href="#sistema" className="hidden sm:inline font-display text-[11px] uppercase tracking-[0.24em] text-[#9A9EA6] hover:text-white transition-colors">
            Sistema
          </a>
          <a href="#prazos" className="hidden sm:inline font-display text-[11px] uppercase tracking-[0.24em] text-[#9A9EA6] hover:text-white transition-colors">
            Prazos
          </a>
          <Link
            to="/login"
            className="font-display text-[11px] uppercase tracking-[0.24em] text-white border border-[#2B2E35] hover:border-[#5B93FF] hover:text-[#5B93FF] px-4 py-2 rounded-full transition-colors"
          >
            Entrar
          </Link>
        </nav>
      </div>
    </header>

    {/* HERO — marca tipográfica gigante */}
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(38,109,240,0.14),transparent_60%)]"
      />
      <div className="relative">
        <Eyebrow>Controle de contratos &amp; prazos</Eyebrow>
        <h1 className="font-display mt-6 text-[clamp(3rem,11vw,9rem)] font-bold uppercase leading-[0.95] tracking-[0.02em] text-white">
          Project<span className="text-[#5B93FF]">Sight</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-[#9A9EA6] leading-relaxed">
          Cronogramas de Topografia, Geologia e Meio Ambiente em um só lugar — fases, etapas, responsáveis e vencimentos calculados automaticamente.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            className="font-display h-11 px-7 inline-flex items-center rounded-full bg-[#266DF0] text-white text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-[#1D5AD1] transition-colors"
          >
            Acessar painel
          </Link>
          <a
            href="#sistema"
            className="font-display h-11 px-7 inline-flex items-center rounded-full border border-[#2B2E35] text-[12px] font-medium uppercase tracking-[0.2em] text-[#C9CCD2] hover:border-[#5B93FF] hover:text-white transition-colors"
          >
            Ver como funciona
          </a>
        </div>
      </div>

      {/* Indicador vertical de seção */}
      <div aria-hidden="true" className="hidden md:flex absolute right-8 bottom-10 flex-col items-center gap-3">
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-[#6B6F78] [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="block w-px h-12 bg-gradient-to-b from-[#6B6F78] to-transparent" />
      </div>
    </section>

    {/* SISTEMA — janela clara flutuando sobre o fundo escuro */}
    <section id="sistema" className="max-w-6xl mx-auto px-6 pb-28 scroll-mt-16">
      <div className="flex items-center gap-4 mb-8">
        <span className="font-display text-xs text-[#5B93FF]">01</span>
        <span className="h-px flex-1 bg-[#1E2025]" />
        <Eyebrow>O sistema</Eyebrow>
      </div>
      <div className="shadow-[0_40px_120px_-30px_rgba(38,109,240,0.35)] rounded-xl">
        <InteractiveWorkspacePreview />
      </div>
    </section>

    {/* ESTRUTURA */}
    <section className="max-w-6xl mx-auto px-6 pb-28">
      <div className="flex items-center gap-4 mb-12">
        <span className="font-display text-xs text-[#5B93FF]">02</span>
        <span className="h-px flex-1 bg-[#1E2025]" />
        <Eyebrow>Estrutura</Eyebrow>
      </div>

      <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-[0.02em] leading-tight max-w-3xl">
        Contrato <span className="text-[#5B93FF]">→</span> Fases <span className="text-[#5B93FF]">→</span> Etapas
      </h2>
      <p className="mt-4 max-w-xl text-[#9A9EA6] leading-relaxed">
        Em vez de planilhas paralelas, os dados ficam organizados em três níveis conectados à equipe técnica e ao histórico de auditoria.
      </p>

      <div className="mt-12 grid md:grid-cols-3 border border-[#1E2025] rounded-2xl bg-[#101114] divide-y md:divide-y-0 md:divide-x divide-[#1E2025] overflow-hidden">
        {[
          { n: 'Nível 01', t: 'Registro do contrato', d: 'Cliente, frente técnica, diretor responsável, direitos minerários, dias de campo e data limite de entrega.' },
          { n: 'Nível 02', t: 'Divisão em fases', d: 'Mobilização, levantamento de campo, processamento e relatório final, sempre em ordem cronológica.' },
          { n: 'Nível 03', t: 'Etapas e responsáveis', d: 'Tarefas com profissional atribuído, datas, observações técnicas e controle de avanço por etapa.' },
        ].map((c) => (
          <div key={c.n} className="p-8">
            <Eyebrow>{c.n}</Eyebrow>
            <h3 className="font-display mt-4 text-xl font-semibold text-white">{c.t}</h3>
            <p className="mt-3 text-sm text-[#9A9EA6] leading-relaxed">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid md:grid-cols-3 gap-5">
        {[
          { t: 'Equipe e alocação', d: 'Profissionais por função e contagem automática de contratos ativos por pessoa.' },
          { t: 'Gargalos e prazos', d: 'Aba analítica para ver quais fases concentram atrasos e quais contratos vencem na semana.' },
          { t: 'Rastreabilidade e CSV', d: 'Log cronológico de alterações e exportação imediata da listagem em CSV.' },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-[#1E2025] bg-[#101114] p-6">
            <h3 className="font-display text-base font-semibold text-white">{c.t}</h3>
            <p className="mt-2 text-sm text-[#9A9EA6] leading-relaxed">{c.d}</p>
          </div>
        ))}
      </div>
    </section>

    {/* REGRAS DE PRAZO */}
    <section id="prazos" className="max-w-6xl mx-auto px-6 pb-28 scroll-mt-16">
      <div className="flex items-center gap-4 mb-12">
        <span className="font-display text-xs text-[#5B93FF]">03</span>
        <span className="h-px flex-1 bg-[#1E2025]" />
        <Eyebrow>Regras de prazo</Eyebrow>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-[0.02em] leading-tight">
            Status calculado, não preenchido
          </h2>
          <p className="mt-4 text-[#9A9EA6] leading-relaxed">
            A situação de cada contrato vem da relação entre a data atual, a data de entrega e o percentual concluído.
          </p>
        </div>

        <div className="lg:col-span-7 border border-[#1E2025] rounded-2xl overflow-hidden divide-y divide-[#1E2025] bg-[#101114]">
          {[
            { s: 'No prazo', c: 'text-[#4ADE80] bg-[#4ADE80]/10 border-[#4ADE80]/25', d: 'bg-[#4ADE80]', cond: 'Mais de 7 dias até a entrega', desc: 'Cronograma normal, sem alerta de vencimento.' },
            { s: 'Atenção', c: 'text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/25', d: 'bg-[#FBBF24]', cond: 'Entre 1 e 7 dias restantes', desc: 'Entra na faixa de prioridade semanal.' },
            { s: 'Atrasado', c: 'text-[#F87171] bg-[#F87171]/10 border-[#F87171]/25', d: 'bg-[#F87171]', cond: 'Prazo vencido (< 0 dias)', desc: 'Destacado no topo do painel executivo.' },
            { s: 'Concluído', c: 'text-[#9A9EA6] bg-white/5 border-white/10', d: 'bg-[#9A9EA6]', cond: '100% das etapas finalizadas', desc: 'Mantido no histórico para consulta.' },
          ].map((i) => (
            <div key={i.s} className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span className={`inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${i.c}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${i.d}`} />
                {i.s}
              </span>
              <div>
                <p className="font-mono text-xs text-[#C9CCD2]">{i.cond}</p>
                <p className="text-xs text-[#8A8F98] mt-0.5">{i.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FRENTES TÉCNICAS */}
    <section className="max-w-6xl mx-auto px-6 pb-28">
      <div className="flex items-center gap-4 mb-12">
        <span className="font-display text-xs text-[#5B93FF]">04</span>
        <span className="h-px flex-1 bg-[#1E2025]" />
        <Eyebrow>Frentes técnicas</Eyebrow>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {[
          { n: '01', t: 'Topografia', d: 'Planialtimétrico, cadastral, georreferenciamento e apoio de campo.', itens: ['Marcos e poligonais', 'Aerofotogrametria e MDT', 'Memoriais e plantas'] },
          { n: '02', t: 'Geologia', d: 'Exploração, acompanhamento de sondagem, mapeamento e modelagem.', itens: ['Locação de furos', 'Descrição litológica', 'Modelagem 3D e cubagem'] },
          { n: '03', t: 'Meio Ambiente', d: 'Estudos, licenciamento, planos de controle e condicionantes.', itens: ['PCA', 'Inventário florístico', 'Relatórios de acompanhamento'] },
        ].map((f) => (
          <div key={f.n} className="rounded-2xl border border-[#1E2025] bg-[#101114] p-7 hover:border-[#266DF0]/50 transition-colors">
            <span className="font-display text-xs text-[#5B93FF]">{f.n}</span>
            <h3 className="font-display mt-3 text-2xl font-bold uppercase tracking-[0.03em] text-white">{f.t}</h3>
            <p className="mt-3 text-sm text-[#9A9EA6] leading-relaxed">{f.d}</p>
            <ul className="mt-6 pt-5 border-t border-[#1E2025] space-y-2">
              {f.itens.map((it) => (
                <li key={it} className="text-xs text-[#C9CCD2] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#5B93FF]" aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    {/* RODAPÉ */}
    <footer className="border-t border-[#1E2025]">
      <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-display text-lg font-bold uppercase tracking-[0.12em] text-white">
            Project<span className="text-[#5B93FF]">Sight</span>
          </p>
          <p className="text-xs text-[#8A8F98] mt-1">Controle de contratos, cronogramas e prazos</p>
        </div>
        <Link
          to="/login"
          className="font-display h-11 px-7 inline-flex items-center rounded-full bg-[#266DF0] text-white text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-[#1D5AD1] transition-colors"
        >
          Acessar o sistema
        </Link>
      </div>
    </footer>
  </div>
);

export default Landing;

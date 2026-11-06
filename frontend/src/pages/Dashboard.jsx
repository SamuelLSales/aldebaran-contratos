import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  AlertCircle,
  Clock,
  User,
  Calendar,
  ArrowRight,
  Search,
  AlertTriangle,
  CheckCircle,
  FolderOpen,
  FileSpreadsheet,
  Plus,
  Layers,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { getDashboardData, getContratos, exportarCSV } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_contratos: 0,
    contratos_no_prazo: 0,
    contratos_atencao: 0,
    contratos_atrasados: 0,
    contratos_concluidos: 0,
    progresso_medio_geral: 0,
    distribuicao_area: { Topografia: 0, Geologia: 0, Outros: 0 },
    proximos_vencimentos: []
  });
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controle de Abas
  const [abaAtiva, setAbaAtiva] = useState('geral'); // 'geral' ou 'gargalos'

  // Filtro de contratos em aberto
  const [termoBusca, setTermoBusca] = useState('');
  const [areaFiltro, setAreaFiltro] = useState('todas');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const [dadosDashboard, listaContratos] = await Promise.all([
          getDashboardData(),
          getContratos()
        ]);
        setStats(dadosDashboard);
        setContratos(listaContratos);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setError("Falha ao carregar os dados. Verifique a conexão com o servidor local.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Funções utilitárias
  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    try {
      const dataApenas = dataStr.split('T')[0];
      const [ano, mes, dia] = dataApenas.split('-');
      return `${dia}/${mes}/${ano}`;
    } catch (e) {
      return dataStr;
    }
  };

  const calcularDiasRestantes = (dataFinal) => {
    if (!dataFinal) return null;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataApenas = dataFinal.split('T')[0];
    const partes = dataApenas.split('-');
    if (partes.length < 3) return null;
    const [ano, mes, dia] = partes;
    const entrega = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    const diffTime = entrega - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const obterProgressoContrato = (contrato) => {
    const etapas = [];
    contrato.fases?.forEach(f => {
      f.etapas?.forEach(e => {
        etapas.push(e);
      });
    });
    if (etapas.length === 0) return 0;
    const soma = etapas.reduce((acc, e) => acc + (e.progresso || 0), 0);
    return Math.round((soma / etapas.length) * 100);
  };

  const obterDiasAtraso = (dataTerminoStr) => {
    if (!dataTerminoStr) return 0;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataApenas = dataTerminoStr.split('T')[0];
    const [ano, mes, dia] = dataApenas.split('-');
    const entrega = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    const diffTime = hoje - entrega;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const isConcluido = (status) => {
    if (!status) return false;
    const s = String(status).toLowerCase().trim();
    return s.includes('concl') || s.includes('conug') || s.includes('ug');
  };

  // Processar Etapas Atrasadas (Gargalos)
  const obterEtapasAtrasadas = () => {
    const atrasadas = [];
    contratos.forEach(contrato => {
      if (isConcluido(contrato.status)) return;

      contrato.fases?.forEach(fase => {
        fase.etapas?.forEach(etapa => {
          if ((etapa.progresso || 0) < 1 && etapa.data_termino) {
            const diasAtraso = obterDiasAtraso(etapa.data_termino);
            if (diasAtraso > 0) {
              atrasadas.push({
                id: etapa.id,
                nome_tarefa: etapa.nome_tarefa,
                responsavel: etapa.responsavel || 'Sem Responsável',
                data_termino: etapa.data_termino,
                dias_atraso: diasAtraso,
                progresso: Math.round((etapa.progresso || 0) * 100),
                contrato_id: contrato.id,
                nome_projeto: contrato.nome_projeto,
                nome_fase: fase.nome_fase
              });
            }
          }
        });
      });
    });
    return atrasadas.sort((a, b) => b.dias_atraso - a.dias_atraso);
  };

  const etapasAtrasadas = obterEtapasAtrasadas();

  // Calcular agregados de gargalo
  const obterAgregadosGargalo = () => {
    const delaysByCollab = {};
    const delaysByFase = { 'Planejamento': 0, 'Campo/Mapeamento': 0, 'Relatório/Escritório': 0, 'Outros': 0 };

    etapasAtrasadas.forEach(e => {
      delaysByCollab[e.responsavel] = (delaysByCollab[e.responsavel] || 0) + e.dias_atraso;

      const nomeLower = e.nome_fase.toLowerCase();
      if (nomeLower.includes('planejamento')) {
        delaysByFase['Planejamento'] += e.dias_atraso;
      } else if (nomeLower.includes('campo') || nomeLower.includes('mapeamento') || nomeLower.includes('execução')) {
        delaysByFase['Campo/Mapeamento'] += e.dias_atraso;
      } else if (nomeLower.includes('relatório') || nomeLower.includes('elaboração') || nomeLower.includes('escritório')) {
        delaysByFase['Relatório/Escritório'] += e.dias_atraso;
      } else {
        delaysByFase['Outros'] += e.dias_atraso;
      }
    });

    const colabGargalos = Object.entries(delaysByCollab).map(([nome, dias]) => {
      const count = etapasAtrasadas.filter(e => e.responsavel === nome).length;
      return { nome, dias, count };
    }).sort((a, b) => b.dias - a.dias);

    const faseGargalos = Object.entries(delaysByFase)
      .map(([fase, dias]) => ({ fase, dias }))
      .filter(f => f.dias > 0)
      .sort((a, b) => b.dias - a.dias);

    let respCritico = 'Nenhum';
    let maxCollabDelay = 0;
    Object.entries(delaysByCollab).forEach(([name, delay]) => {
      if (delay > maxCollabDelay) {
        maxCollabDelay = delay;
        respCritico = name;
      }
    });

    const mediaAtraso = etapasAtrasadas.length > 0
      ? Math.round(etapasAtrasadas.reduce((acc, e) => acc + e.dias_atraso, 0) / etapasAtrasadas.length)
      : 0;

    const maiorAtraso = etapasAtrasadas.length > 0 ? etapasAtrasadas[0].dias_atraso : 0;

    return {
      colabGargalos,
      faseGargalos,
      respCritico,
      mediaAtraso,
      maiorAtraso
    };
  };

  const gargalosInfo = obterAgregadosGargalo();

  // Filtragem de Contratos em Aberto
  const contratosEmAberto = contratos.filter(c => {
    if (isConcluido(c.status)) return false;

    const correspondeTexto =
      c.nome_projeto?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.cliente?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.diretor_projeto?.toLowerCase().includes(termoBusca.toLowerCase());

    const correspondeArea =
      areaFiltro === 'todas' ||
      c.area?.toLowerCase() === areaFiltro.toLowerCase();

    return correspondeTexto && correspondeArea;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-xs">Carregando dados do ProjectSight...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1500px] mx-auto animate-fade-in text-slate-900">

      {/* CABEÇALHO EXECUTIVO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Controle Operacional de Contratos
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Monitoramento de contratos, cronogramas e entregas — Topografia, Geologia e Meio Ambiente
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportarCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            Exportar CSV
          </button>
          <button
            onClick={() => navigate('/contratos/novo')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Contrato
          </button>
        </div>
      </div>

      {/* NAVEGAÇÃO POR ABAS */}
      <div className="flex border-b border-slate-200 gap-8">
        <button
          onClick={() => setAbaAtiva('geral')}
          className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors relative cursor-pointer ${
            abaAtiva === 'geral'
              ? 'text-[#1C1D1F] border-b-2 border-[#266DF0]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Visão Geral & Contratos
        </button>
        <button
          onClick={() => setAbaAtiva('gargalos')}
          className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors relative flex items-center gap-2 cursor-pointer ${
            abaAtiva === 'gargalos'
              ? 'text-[#1C1D1F] border-b-2 border-[#266DF0]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Análise de Prazos & Gargalos
          {etapasAtrasadas.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#FFF0EE] text-[#B42318] border border-[#FFD4CE]">
              {etapasAtrasadas.length}
            </span>
          )}
        </button>
      </div>

      {/* ERROS DE CONEXÃO */}
      {error && (
        <div className="bg-[#FFF0EE] text-[#B42318] border border-[#FFD4CE] rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-[#E5392D] w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Problema com o servidor</h4>
            <p className="text-slate-600 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 1: VISÃO GERAL */}
      {abaAtiva === 'geral' && (
        <div className="space-y-6">

          {/* 4 CARDS DE MÉTRICAS EXECUTIVAS (Estilo Attio) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs hover:shadow-card transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Contratos Ativos</span>
                <div className="w-8 h-8 rounded-lg bg-[#F4F5F6] border border-[#E6E7EA] flex items-center justify-center text-[#36383D]">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                  {contratosEmAberto.length}
                </span>
                <span className="text-xs text-slate-500">em andamento</span>
              </div>
            </div>

            {/* Card 2: No Prazo */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs hover:shadow-card transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">No Prazo</span>
                <div className="w-8 h-8 rounded-lg bg-[#EAFBF1] border border-[#C6F0D8] text-[#0E7138] flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                  {stats.contratos_no_prazo || 0}
                </span>
                <span className="text-xs text-slate-500 font-medium">cronograma em dia</span>
              </div>
            </div>

            {/* Card 3: Atenção */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs hover:shadow-card transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Atenção (≤ 7 dias)</span>
                <div className="w-8 h-8 rounded-lg bg-[#FFF6E5] border border-[#FDE2B3] text-[#945300] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                  {stats.contratos_atencao || 0}
                </span>
                <span className="text-xs text-slate-500 font-medium">vence em breve</span>
              </div>
            </div>

            {/* Card 4: Atrasados */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs hover:shadow-card transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Com Atraso</span>
                <div className="w-8 h-8 rounded-lg bg-[#FFF0EE] border border-[#FFD4CE] text-[#B42318] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                  {stats.contratos_atrasados || 0}
                </span>
                <span className={`text-xs font-medium ${(stats.contratos_atrasados || 0) > 0 ? 'text-[#B42318] font-semibold' : 'text-slate-500'}`}>
                  requer ação
                </span>
              </div>
            </div>
          </div>

          {/* TABELA DE CONTRATOS EM ABERTO */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
            
            {/* Barra de Filtros */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Projetos em Andamento
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Acompanhamento de prazos de entrega e medições
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Campo de Busca */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    placeholder="Filtrar por projeto ou cliente..."
                    className="w-[200px] sm:w-[260px] pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>

                {/* Filtro por Área */}
                <select
                  value={areaFiltro}
                  onChange={(e) => setAreaFiltro(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-300 text-slate-700 text-xs rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 cursor-pointer transition-all"
                >
                  <option value="todas">Todas as Áreas</option>
                  <option value="topografia">Topografia</option>
                  <option value="geologia">Geologia</option>
                  <option value="meio-ambiente">Meio Ambiente</option>
                </select>
              </div>
            </div>

            {/* Conteúdo da Tabela */}
            {contratosEmAberto.length === 0 ? (
              <div className="text-center py-16 px-4 text-slate-500 text-sm">
                <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                Nenhum contrato em aberto localizado com os filtros aplicados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase font-semibold text-slate-500 tracking-wider">
                      <th className="py-3 px-4">Projeto / Cliente</th>
                      <th className="py-3 px-4">Área</th>
                      <th className="py-3 px-4">Diretor Responsável</th>
                      <th className="py-3 px-4">Prazo de Entrega</th>
                      <th className="py-3 px-4">Dias Restantes</th>
                      <th className="py-3 px-4">Progresso Geral</th>
                      <th className="py-3 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {contratosEmAberto.map(contrato => {
                      const progresso = obterProgressoContrato(contrato);
                      const diasRestantes = calcularDiasRestantes(contrato.data_entrega_final);

                      // Estilização do badge de dias restantes
                      let diasBadge = (
                        <span className="text-slate-400 font-mono text-xs">-</span>
                      );

                      if (diasRestantes !== null) {
                        if (diasRestantes < 0) {
                          diasBadge = (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FFF0EE] text-[#B42318] border border-[#FFD4CE] font-mono">
                              Atrasado há {Math.abs(diasRestantes)}d
                            </span>
                          );
                        } else if (diasRestantes <= 7) {
                          diasBadge = (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FFF6E5] text-[#945300] border border-[#FDE2B3] font-mono">
                              {diasRestantes} dias
                            </span>
                          );
                        } else {
                          diasBadge = (
                            <span className="text-slate-700 font-medium font-mono text-xs">
                              {diasRestantes} dias
                            </span>
                          );
                        }
                      }

                      // Badge de área estilo Attio
                      const currentAreaStyle = 'bg-[#F4F5F6] text-[#36383D] border-[#E6E7EA]';

                      return (
                        <tr
                          key={contrato.id}
                          onClick={() => navigate(`/contratos/${contrato.id}`)}
                          className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                        >
                          {/* Projeto e Cliente */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900 group-hover:text-[#266DF0] transition-colors">
                              {contrato.nome_projeto}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {contrato.cliente}
                            </div>
                          </td>

                          {/* Área */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${currentAreaStyle}`}>
                              {contrato.area}
                            </span>
                          </td>

                          {/* Diretor Responsável */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#EEF4FF] text-[#266DF0] border border-[#D4E2FF] text-[10px] font-semibold flex items-center justify-center uppercase">
                                {contrato.diretor_projeto ? contrato.diretor_projeto.substring(0, 2) : '??'}
                              </div>
                              <span className="text-xs font-medium text-slate-700">
                                {contrato.diretor_projeto}
                              </span>
                            </div>
                          </td>

                          {/* Entrega Prevista */}
                          <td className="py-3.5 px-4 text-xs font-mono text-slate-600 whitespace-nowrap">
                            {formatarData(contrato.data_entrega_final)}
                          </td>

                          {/* Dias Restantes */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {diasBadge}
                          </td>

                          {/* Barra de Progresso */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3 min-w-[130px]">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    contrato.status === 'atrasado'
                                      ? 'bg-[#E5392D]'
                                      : 'bg-[#266DF0]'
                                  }`}
                                  style={{ width: `${progresso}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold font-mono text-slate-700 w-8 text-right">
                                {progresso}%
                              </span>
                            </div>
                          </td>

                          {/* Ação */}
                          <td className="py-3.5 px-4 text-right">
                            <span className="inline-flex p-1 text-slate-400 group-hover:text-slate-700 transition-colors">
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: ANÁLISE DE GARGALOS */}
      {abaAtiva === 'gargalos' && (
        <div className="space-y-6 animate-fade-in">
          {/* CARDS DE RESUMO DE ATRASOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Tarefas Vencidas</span>
                <div className="w-8 h-8 rounded-lg bg-[#FFF0EE] border border-[#FFD4CE] text-[#B42318] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {etapasAtrasadas.length.toString().padStart(2, '0')}
                </span>
                <span className="text-xs text-[#B42318] font-medium">pendentes</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Média de Atraso</span>
                <div className="w-8 h-8 rounded-lg bg-[#F4F5F6] border border-[#E6E7EA] text-[#36383D] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {gargalosInfo.mediaAtraso}
                </span>
                <span className="text-xs text-slate-500 font-medium">dias por atividade</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Maior Atraso Único</span>
                <div className="w-8 h-8 rounded-lg bg-[#FFF0EE] border border-[#FFD4CE] text-[#B42318] flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-[#B42318]">
                  {gargalosInfo.maiorAtraso}
                </span>
                <span className="text-xs text-slate-500 font-medium">dias no maior gargalo</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Maior Acúmulo</span>
                <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] border border-[#D4E2FF] text-[#266DF0] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-bold text-slate-900 truncate" title={gargalosInfo.respCritico}>
                  {gargalosInfo.respCritico}
                </h4>
                <span className="text-[11px] text-slate-500">responsável técnico</span>
              </div>
            </div>
          </div>

          {/* GRÁFICOS DE ANÁLISE DE GARGALOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Atraso por Colaborador */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Demanda Acumulada por Responsável</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dias de atraso somados por colaborador</p>
              </div>

              {gargalosInfo.colabGargalos.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center py-12 text-slate-400 text-xs">
                  Sem atrasos registrados para a equipe técnica.
                </div>
              ) : (
                <div className="space-y-4">
                  {gargalosInfo.colabGargalos.map((colab) => {
                    const maxDelay = gargalosInfo.colabGargalos[0]?.dias || 1;
                    const percent = (colab.dias / maxDelay) * 100;

                    return (
                      <div key={colab.nome} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-800 font-semibold">{colab.nome}</span>
                          <span className="text-slate-500 font-mono">
                            {colab.dias} dias ({colab.count} tarefas)
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#266DF0] rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Atraso por Fase */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Atraso por Fase Operacional</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dias de atraso acumulados em cada etapa do processo</p>
              </div>

              {gargalosInfo.faseGargalos.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center py-12 text-slate-400 text-xs">
                  Sem atrasos registrados por fases.
                </div>
              ) : (
                <div className="space-y-4">
                  {gargalosInfo.faseGargalos.map((fase) => {
                    const maxDelay = gargalosInfo.faseGargalos[0]?.dias || 1;
                    const percent = (fase.dias / maxDelay) * 100;

                    return (
                      <div key={fase.fase} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-800 font-semibold">{fase.fase}</span>
                          <span className="text-slate-500 font-mono">{fase.dias} dias</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1C1D1F] rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* TABELA DE ATIVIDADES VENCIDAS */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900">
                Detalhamento das Atividades Vencidas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Acompanhamento pontual de tarefas que necessitam de intervenção
              </p>
            </div>

            {etapasAtrasadas.length === 0 ? (
              <div className="text-center py-16 text-slate-700 text-sm flex flex-col items-center gap-2">
                <CheckCircle className="w-8 h-8 text-[#12A150]" />
                <span className="font-semibold">Excelente! Nenhuma atividade está atrasada no momento.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase font-semibold text-slate-500 tracking-wider">
                      <th className="py-3 px-4">Tarefa / Etapa</th>
                      <th className="py-3 px-4">Projeto & Fase</th>
                      <th className="py-3 px-4">Responsável</th>
                      <th className="py-3 px-4">Prazo Previsto</th>
                      <th className="py-3 px-4">Atraso</th>
                      <th className="py-3 px-4">Progresso</th>
                      <th className="py-3 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {etapasAtrasadas.map(etapa => (
                      <tr
                        key={etapa.id}
                        onClick={() => navigate(`/contratos/${etapa.contrato_id}`)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-[#266DF0] transition-colors">
                          {etapa.nome_tarefa}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800 text-xs">{etapa.nome_projeto}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{etapa.nome_fase}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                          {etapa.responsavel}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-600">
                          {formatarData(etapa.data_termino)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FFF0EE] text-[#B42318] border border-[#FFD4CE] font-mono">
                            {etapa.dias_atraso}d de atraso
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#E5392D] rounded-full" style={{ width: `${etapa.progresso}%` }}></div>
                            </div>
                            <span className="text-xs font-mono font-medium text-slate-500">{etapa.progresso}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex p-1 text-slate-400 group-hover:text-slate-700 transition-colors">
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
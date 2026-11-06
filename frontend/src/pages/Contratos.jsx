import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FolderOpen, 
  Search, 
  AlertCircle,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { getContratos } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const Contratos = () => {
  const navigate = useNavigate();
  const { area } = useParams(); // 'topografia', 'geologia', 'meio-ambiente' ou undefined
  const { user } = useAuth();

  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [busca, setBusca] = useState('');
  
  // Função para transformar a URL "meio-ambiente" em "Meio Ambiente"
  const formatUrlArea = (urlArea) => {
    if (!urlArea) return 'Todas';
    return urlArea.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const initialArea = formatUrlArea(area);
  const [filtroArea, setFiltroArea] = useState(initialArea);
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  // Atualizar filtro quando a URL muda pela Sidebar
  useEffect(() => {
    setFiltroArea(formatUrlArea(area));
  }, [area]);

  useEffect(() => {
    const carregarContratos = async () => {
      try {
        setLoading(true);
        const data = await getContratos();
        setContratos(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar contratos:', err);
        setError('Não foi possível conectar à API local. Verifique se o backend está rodando.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarContratos();
  }, []);

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    const dataApenas = dataStr.split('T')[0];
    const partes = dataApenas.split('-');
    if (partes.length < 3) return dataStr;
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
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

  const isConcluido = (status) => {
    if (!status) return false;
    const s = String(status).toLowerCase().trim();
    return s.includes('concl') || s.includes('conug') || s.includes('ug');
  };

  const contratosFiltrados = contratos.filter(c => {
    const matchBusca = 
      c.nome_projeto?.toLowerCase().includes(busca.toLowerCase()) || 
      c.cliente?.toLowerCase().includes(busca.toLowerCase()) ||
      c.diretor_projeto?.toLowerCase().includes(busca.toLowerCase());
    
    const matchArea = filtroArea === 'Todas' || c.area === filtroArea;
    const matchStatus = filtroStatus === 'Todos' || 
      (filtroStatus === 'concluido' ? isConcluido(c.status) : c.status === filtroStatus);

    return matchBusca && matchArea && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-xs">Carregando contratos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto animate-fade-in text-slate-900">
      
      {/* CABEÇALHO EDITORIAL CLARO (SEM ÍCONE DECORATIVO ANTES DO TÍTULO) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/90">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400 block mb-2">
            .01 / Portfólio {filtroArea !== 'Todas' ? `— ${filtroArea}` : 'Geral'}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Contratos: {filtroArea !== 'Todas' ? filtroArea : 'Todos os Projetos'}
          </h1>
          <p className="text-slate-500 text-xs mt-1.5">
            Gerencie e acompanhe os detalhes operacionais, cronogramas e entregas
          </p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/contratos/novo')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C1D1F] hover:bg-[#2F3033] text-white rounded-lg font-medium text-xs transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Contrato
          </button>
        )}
      </div>

      {error && (
        <div className="bg-[#FFF0EE] text-[#B42318] rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#E5392D] shrink-0 mt-0.5" />
          <p className="text-xs">{error}</p>
        </div>
      )}

      {/* CONTAINER DE FILTROS E CARDS */}
      <div className="space-y-6">
        
        {/* BARRA DE FILTROS LIMPA (SEM CAIXAS ANINHADAS COM ÍCONES) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Busca textual */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por projeto, cliente ou diretor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/90 hover:border-slate-300 focus:border-slate-400 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={filtroArea}
              onChange={(e) => setFiltroArea(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200/90 hover:border-slate-300 focus:border-slate-400 rounded-lg text-xs text-slate-700 font-medium focus:outline-none cursor-pointer transition-all"
            >
              <option value="Todas">Todas as Áreas</option>
              <option value="Topografia">Topografia</option>
              <option value="Geologia">Geologia</option>
              <option value="Meio Ambiente">Meio Ambiente</option>
            </select>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200/90 hover:border-slate-300 focus:border-slate-400 rounded-lg text-xs text-slate-700 font-medium focus:outline-none cursor-pointer transition-all"
            >
              <option value="Todos">Todos os Status</option>
              <option value="no_prazo">No prazo</option>
              <option value="atencao">Atenção</option>
              <option value="atrasado">Atrasado</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
        </div>

        {/* GRID DE CARDS EDITORIAIS CLAROS */}
        <div>
          {contratosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {contratosFiltrados.map((contrato, index) => {
                const diasRestantes = calcularDiasRestantes(contrato.data_entrega_final);
                const progresso = obterProgressoContrato(contrato);

                return (
                  <div 
                    key={contrato.id} 
                    onClick={() => navigate(`/contratos/${contrato.id}`)}
                    className="bg-white border border-slate-200/85 hover:border-slate-300 rounded-xl p-6 transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    {/* Topo Editorial: Índice + Área e Status */}
                    <div>
                      <div className="flex justify-between items-center gap-2 mb-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                          .{String(index + 1).padStart(2, '0')} &mdash; {contrato.area}
                        </span>
                        <StatusBadge status={contrato.status} />
                      </div>

                      <h3 
                        className="font-display font-semibold text-slate-900 text-base group-hover:text-[#266DF0] transition-colors line-clamp-1 leading-snug" 
                        title={contrato.nome_projeto}
                      >
                        {contrato.nome_projeto}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1 line-clamp-1">
                        {contrato.cliente}
                      </p>
                    </div>

                    {/* Barra de Progresso Minimalista */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                        <span className="uppercase tracking-[0.14em] text-[10px]">Execução</span>
                        <span className="text-slate-700 font-medium tabular-nums">{progresso}%</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            contrato.status === 'atrasado' ? 'bg-[#E5392D]' : 'bg-[#1C1D1F]'
                          }`}
                          style={{ width: `${progresso}%` }}
                        />
                      </div>
                    </div>

                    {/* Rodapé Arquitetônico (Sem caixas cinzas nem botões de largura total) */}
                    <div className="pt-4 mt-5 border-t border-slate-100 flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">
                          Diretor
                        </span>
                        <span className="block text-xs font-medium text-slate-800 truncate mt-0.5">
                          {contrato.diretor_projeto || '—'}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">
                          Entrega · {formatarData(contrato.data_entrega_final)}
                        </span>
                        <div className="font-mono text-xs font-medium mt-0.5 flex items-center justify-end gap-1.5">
                          {isConcluido(contrato.status) ? (
                            <span className="text-[#0E7138]">Finalizado</span>
                          ) : diasRestantes !== null ? (
                            diasRestantes < 0 ? (
                              <span className="text-[#B42318]">Atrasado ({Math.abs(diasRestantes)}d)</span>
                            ) : diasRestantes <= 7 ? (
                              <span className="text-[#945300]">{diasRestantes} dias</span>
                            ) : (
                              <span className="text-slate-600">{diasRestantes} dias</span>
                            )
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3 bg-white rounded-xl border border-dashed border-slate-200">
              <FolderOpen className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
              <p className="text-sm font-medium text-slate-500">Nenhum contrato localizado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contratos;

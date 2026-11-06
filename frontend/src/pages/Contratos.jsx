import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  ChevronRight,
  AlertCircle,
  Plus,
  Compass,
  Layers,
  TreePine,
  CheckCircle2
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

  const getAreaIcon = (areaNome) => {
    if (areaNome === 'Topografia') return <Compass className="w-5 h-5 text-[#434340]" />;
    if (areaNome === 'Geologia') return <Layers className="w-5 h-5 text-[#434340]" />;
    if (areaNome === 'Meio Ambiente') return <TreePine className="w-5 h-5 text-[#434340]" />;
    return <FolderOpen className="w-5 h-5 text-[#434340]" />;
  };

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
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-slate-900">
            {getAreaIcon(filtroArea)}
            Contratos: {filtroArea !== 'Todas' ? filtroArea : 'Todos os Projetos'}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Gerencie e acompanhe os detalhes operacionais, cronogramas e entregas
          </p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/contratos/novo')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold text-xs transition-all shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Contrato
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-800 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-xs">{error}</p>
        </div>
      )}

      {/* CONTAINER DE FILTROS E CARDS */}
      <div className="space-y-6">
        
        {/* FILTROS DE PESQUISA */}
        <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Busca textual */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por projeto, cliente ou diretor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filtrar por Área */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filtroArea}
                onChange={(e) => setFiltroArea(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="Todas">Todas as Áreas</option>
                <option value="Topografia">Topografia</option>
                <option value="Geologia">Geologia</option>
                <option value="Meio Ambiente">Meio Ambiente</option>
              </select>
            </div>

            {/* Filtrar por Status */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="Todos">Todos os Status</option>
                <option value="no_prazo">No prazo</option>
                <option value="atencao">Atenção</option>
                <option value="atrasado">Atrasado</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>
        </div>

        {/* GRID DE CARDS CORPORATIVOS */}
        <div>
          {contratosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {contratosFiltrados.map((contrato) => {
                const diasRestantes = calcularDiasRestantes(contrato.data_entrega_final);
                const currentAreaStyle = 'bg-[#F4F5F6] text-[#36383D] border-[#E6E7EA]';

                return (
                  <div 
                    key={contrato.id} 
                    className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between group"
                  >
                    {/* Cabeçalho do Card */}
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2.5">
                        <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${currentAreaStyle}`}>
                          {contrato.area}
                        </span>
                        <StatusBadge status={contrato.status} />
                      </div>

                      <h3 
                        className="font-bold text-slate-900 text-base group-hover:text-[#266DF0] transition-colors line-clamp-1" 
                        title={contrato.nome_projeto}
                      >
                        {contrato.nome_projeto}
                      </h3>
                      <p className="text-slate-500 text-xs font-medium mt-0.5 line-clamp-1">
                        Cliente: {contrato.cliente}
                      </p>
                    </div>

                    {/* Informações Centrais */}
                    <div className="space-y-3 my-4 flex-1">
                      {/* Diretor Responsável */}
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#EEF4FF] text-[#266DF0] border border-[#D4E2FF] text-[9px] font-semibold flex items-center justify-center uppercase">
                          {contrato.diretor_projeto ? contrato.diretor_projeto.substring(0, 2) : '??'}
                        </div>
                        <span className="text-xs text-slate-600 truncate">
                          Diretor: <strong className="text-slate-800 font-medium">{contrato.diretor_projeto}</strong>
                        </span>
                      </div>
                      
                      {/* Datas e Prazos */}
                      <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-2.5 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Entrega: {formatarData(contrato.data_entrega_final)}</span>
                        </div>
                        <div className="font-mono font-semibold">
                          {isConcluido(contrato.status) ? (
                            <span className="text-[#0E7138]">Finalizado</span>
                          ) : diasRestantes !== null ? (
                            diasRestantes < 0 ? (
                              <span className="text-[#B42318]">Atrasado ({Math.abs(diasRestantes)}d)</span>
                            ) : diasRestantes <= 7 ? (
                              <span className="text-[#945300]">{diasRestantes} dias</span>
                            ) : (
                              <span className="text-slate-700">{diasRestantes} dias</span>
                            )
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rodapé do Card */}
                    <div className="pt-3 border-t border-slate-100">
                      <button
                        onClick={() => navigate(`/contratos/${contrato.id}`)}
                        className="w-full py-2 bg-slate-50 hover:bg-primary text-slate-700 hover:text-white rounded-lg text-xs font-semibold border border-slate-200 hover:border-transparent transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        Ver Detalhes do Contrato
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3 bg-white rounded-xl border border-dashed border-slate-200">
              <FolderOpen className="w-10 h-10 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">Nenhum contrato localizado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contratos;

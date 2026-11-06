import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Plus, 
  Trash2, 
  User, 
  Calendar, 
  Clock, 
  Check, 
  AlertTriangle, 
  History,
  FileText,
  Save, 
  X,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  CheckCircle2,
  FolderOpen,
  MapPin,
  Compass,
  Layers,
  TreePine,
  CheckCircle,
  Circle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { 
  getContrato, 
  updateContrato, 
  deleteContrato,
  createFase, 
  updateFase, 
  deleteFase, 
  createEtapa, 
  updateEtapa, 
  deleteEtapa, 
  getResponsaveis,
  exportarCSV
} from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DetalheContrato = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  // Diálogo de confirmação (substitui window.confirm): { titulo, mensagem, rotulo, acao }
  const [confirmacao, setConfirmacao] = useState(null);
  const [confirmando, setConfirmando] = useState(false);

  const executarConfirmacao = async () => {
    try {
      setConfirmando(true);
      await confirmacao.acao();
    } finally {
      setConfirmando(false);
      setConfirmacao(null);
    }
  };
  
  const [contrato, setContrato] = useState(null);
  const [responsaveis, setResponsaveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Aba ativa: 'cronograma' ou 'historico'
  const [abaAtiva, setAbaAtiva] = useState('cronograma');

  // Estados dos Modais
  const [modalContratoAberto, setModalContratoAberto] = useState(false);
  const [modalFaseAberto, setModalFaseAberto] = useState(false);
  const [fasesExpandidas, setFasesExpandidas] = useState({});
  const [modalEtapaAberto, setModalEtapaAberto] = useState(false);

  // Estados dos Formulários
  const [editContratoForm, setEditContratoForm] = useState({});
  const [faseForm, setFaseForm] = useState({ id: null, nome_fase: '', ordem: 1 });
  const [etapaForm, setEtapaForm] = useState({
    id: null,
    fase_id: null,
    nome_tarefa: '',
    responsavel: '',
    progresso: 0,
    data_inicio: '',
    data_termino: '',
    dias_previstos: 0,
    observacoes: ''
  });

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [dadosContrato, listaResponsaveis] = await Promise.all([
        getContrato(id),
        getResponsaveis()
      ]);
      setContrato(dadosContrato);
      setEditContratoForm(dadosContrato);
      setResponsaveis(listaResponsaveis);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar detalhes do contrato:', err);
      setError('Erro ao carregar dados do contrato. Certifique-se de que o backend está online.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirContrato = () => {
    setConfirmacao({
      titulo: 'Excluir contrato',
      mensagem: 'Esta ação é irreversível e apagará todas as fases, etapas e históricos associados a este contrato.',
      rotulo: 'Excluir contrato',
      acao: async () => {
        try {
          await deleteContrato(contrato.id);
          toast.success('Contrato excluído.');
          navigate('/contratos');
        } catch (err) {
          console.error('Erro ao excluir contrato:', err);
          toast.error('Não foi possível excluir o contrato.');
        }
      },
    });
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

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

  const formatarDataHora = (dataStr) => {
    if (!dataStr) return '-';
    try {
      const d = new Date(dataStr);
      return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
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
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const obterIniciais = (nome) => {
    if (!nome) return 'U';
    const partes = nome.trim().split(' ');
    if (partes.length > 1) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return nome.slice(0, 2).toUpperCase();
  };

  const calcularProgressoGeral = () => {
    if (!contrato || !contrato.fases) return 0;
    const todasEtapas = contrato.fases.flatMap(f => f.etapas || []);
    if (todasEtapas.length === 0) return 0;
    const soma = todasEtapas.reduce((acc, e) => acc + (e.progresso || 0), 0);
    return Math.round((soma / todasEtapas.length) * 100);
  };

  const toggleFase = (faseId) => {
    setFasesExpandidas(prev => ({
      ...prev,
      [faseId]: prev[faseId] === false ? true : false
    }));
  };

  // 1. Atualizar Contrato
  const handleSalvarContrato = async (e) => {
    e.preventDefault();
    try {
      const dataInicio = editContratoForm.data_inicio ? new Date(editContratoForm.data_inicio).toISOString() : null;
      const dataEntrega = editContratoForm.data_entrega_final ? new Date(editContratoForm.data_entrega_final).toISOString() : null;
      
      await updateContrato(contrato.id, {
        ...editContratoForm,
        data_inicio: dataInicio,
        data_entrega_final: dataEntrega,
        dias_campo_total: parseInt(editContratoForm.dias_campo_total) || 0
      });
      setModalContratoAberto(false);
      carregarDados();
    } catch (err) {
      console.error('Erro ao atualizar contrato:', err);
      toast.error('Erro ao atualizar dados do contrato.');
    }
  };

  // 2. Salvar Fase
  const handleSalvarFase = async (e) => {
    e.preventDefault();
    try {
      if (faseForm.id) {
        await updateFase(faseForm.id, {
          nome_fase: faseForm.nome_fase,
          ordem: parseInt(faseForm.ordem) || 1
        });
      } else {
        await createFase({
          contrato_id: contrato.id,
          nome_fase: faseForm.nome_fase,
          ordem: parseInt(faseForm.ordem) || 1
        });
      }
      setModalFaseAberto(false);
      setFaseForm({ id: null, nome_fase: '', ordem: (contrato.fases?.length || 0) + 1 });
      carregarDados();
    } catch (err) {
      console.error('Erro ao salvar fase:', err);
      toast.error('Erro ao salvar os dados da fase.');
    }
  };

  const abrirModalCriarFase = () => {
    setFaseForm({ id: null, nome_fase: '', ordem: contrato.fases ? contrato.fases.length + 1 : 1 });
    setModalFaseAberto(true);
  };

  const abrirModalEditarFase = (fase) => {
    setFaseForm({ id: fase.id, nome_fase: fase.nome_fase, ordem: fase.ordem });
    setModalFaseAberto(true);
  };

  const handleExcluirFase = (faseId, nome) => {
    setConfirmacao({
      titulo: 'Excluir fase',
      mensagem: `A fase "${nome}" e todas as suas etapas serão apagadas definitivamente.`,
      rotulo: 'Excluir fase',
      acao: async () => {
        try {
          await deleteFase(faseId);
          toast.success('Fase excluída.');
          carregarDados();
        } catch (err) {
          console.error('Erro ao excluir fase:', err);
          toast.error('Não foi possível excluir a fase.');
        }
      },
    });
  };

  // 3. Etapas
  const abrirModalCriarEtapa = (faseId) => {
    setEtapaForm({
      id: null,
      fase_id: faseId,
      nome_tarefa: '',
      responsavel: responsaveis[0]?.nome || '',
      progresso: 0,
      data_inicio: '',
      data_termino: '',
      dias_previstos: 0,
      observacoes: ''
    });
    setModalEtapaAberto(true);
  };

  const abrirModalEditarEtapa = (etapa) => {
    setEtapaForm({
      id: etapa.id,
      fase_id: etapa.fase_id,
      nome_tarefa: etapa.nome_tarefa,
      responsavel: etapa.responsavel,
      progresso: Math.round(etapa.progresso * 100),
      data_inicio: etapa.data_inicio ? etapa.data_inicio.split('T')[0] : '',
      data_termino: etapa.data_termino ? etapa.data_termino.split('T')[0] : '',
      dias_previstos: etapa.dias_previstos,
      observacoes: etapa.observacoes || ''
    });
    setModalEtapaAberto(true);
  };

  const handleSalvarEtapa = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nome_tarefa: etapaForm.nome_tarefa,
        responsavel: etapaForm.responsavel,
        progresso: parseFloat(etapaForm.progresso) / 100,
        data_inicio: etapaForm.data_inicio ? new Date(etapaForm.data_inicio).toISOString() : null,
        data_termino: etapaForm.data_termino ? new Date(etapaForm.data_termino).toISOString() : null,
        dias_previstos: parseInt(etapaForm.dias_previstos) || 0,
        observacoes: etapaForm.observacoes
      };

      if (etapaForm.id) {
        await updateEtapa(etapaForm.id, payload);
      } else {
        await createEtapa({
          fase_id: etapaForm.fase_id,
          ...payload
        });
      }
      setModalEtapaAberto(false);
      carregarDados();
    } catch (err) {
      console.error('Erro ao salvar etapa:', err);
      toast.error('Erro ao salvar os dados da etapa.');
    }
  };

  const handleExcluirEtapa = (etapaId, nome) => {
    setConfirmacao({
      titulo: 'Excluir etapa',
      mensagem: `Deseja realmente excluir a etapa "${nome}"?`,
      rotulo: 'Excluir etapa',
      acao: async () => {
        try {
          await deleteEtapa(etapaId);
          toast.success('Etapa excluída.');
          carregarDados();
        } catch (err) {
          console.error('Erro ao excluir etapa:', err);
          toast.error('Não foi possível remover a etapa.');
        }
      },
    });
  };

  const handleProgressoSlider = async (etapa, novoValorDecimal) => {
    try {
      await updateEtapa(etapa.id, { progresso: novoValorDecimal });
      setContrato(prev => {
        const fasesAtualizadas = prev.fases.map(f => {
          const etapasAtualizadas = f.etapas.map(e => {
            if (e.id === etapa.id) return { ...e, progresso: novoValorDecimal };
            return e;
          });
          return { ...f, etapas: etapasAtualizadas };
        });
        return { ...prev, fases: fasesAtualizadas };
      });
      const dadosAtualizados = await getContrato(id);
      setContrato(dadosAtualizados);
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
    }
  };

  const handleConcluirEtapa = (etapa) => {
    handleProgressoSlider(etapa, 1.0);
  };

  if (loading && !contrato) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-xs">Carregando detalhes do contrato...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-slate-900 max-w-xl mx-auto mt-12 bg-rose-50 border border-rose-200 rounded-xl">
        <div className="flex items-center gap-2 text-rose-700">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-base font-bold">Erro de Carregamento</h2>
        </div>
        <p className="text-slate-600 text-xs mt-2">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const progressoGeral = calcularProgressoGeral();
  const diasRestantes = calcularDiasRestantes(contrato.data_entrega_final);

  // Totais de etapas
  const todasEtapas = contrato.fases?.flatMap(f => f.etapas || []) || [];
  const totalEtapasCount = todasEtapas.length;
  const etapasConcluidasCount = todasEtapas.filter(e => (e.progresso || 0) >= 1.0).length;

  const currentAreaStyle = 'bg-[#f4f1ef] text-[#2b2b27] border-[#e9e5e0]';

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1500px] mx-auto animate-fade-in text-slate-900">
      
      {/* NAVEGAÇÃO SUPERIOR / CABEÇALHO DO PROJETO */}
      <div className="space-y-3 pb-2 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button 
            onClick={() => navigate('/contratos')}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Voltar aos Contratos
          </button>

          {/* Ações Rápidas no Topo */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportarCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              Exportar CSV
            </button>

            {user?.role === 'admin' && (
              <>
                <button
                  onClick={() => setModalContratoAberto(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  Editar
                </button>

                <button
                  onClick={handleExcluirContrato}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0EE] text-[#B42318] hover:bg-[#FFE0DC] border border-[#FFD4CE] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="Excluir Contrato"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir
                </button>
              </>
            )}
          </div>
        </div>

        {/* Título e Metadados Imediatos */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${currentAreaStyle}`}>
                {contrato.area}
              </span>
              <StatusBadge status={contrato.status} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {contrato.nome_projeto}
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Cliente: <strong className="text-slate-800 font-semibold">{contrato.cliente}</strong> &bull; Executor: {contrato.empresa}
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🏛️ GRID CORPORATIVO 70 / 30 */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ====================================================== */}
        {/* COLUNA ESQUERDA (70% - Operação, Fases, Tarefas, Histórico) */}
        {/* ====================================================== */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* BARRA DE NAVEGAÇÃO DE ABAS */}
          <div className="flex border-b border-slate-200 gap-6">
            <button
              onClick={() => setAbaAtiva('cronograma')}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 ${
                abaAtiva === 'cronograma'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              Cronograma Operacional
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                {totalEtapasCount}
              </span>
            </button>

            <button
              onClick={() => setAbaAtiva('historico')}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 ${
                abaAtiva === 'historico'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              Histórico & Auditoria
              {contrato.historicos && contrato.historicos.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  {contrato.historicos.length}
                </span>
              )}
            </button>
          </div>

          {/* ABA 1: CRONOGRAMA OPERACIONAL */}
          {abaAtiva === 'cronograma' && (
            <div className="space-y-4">
              
              {/* Barra de Ação de Fases */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Fases do Projeto e Linha de Produção
                </span>

                {user?.role === 'admin' && (
                  <button
                    onClick={abrirModalCriarFase}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Fase
                  </button>
                )}
              </div>

              {/* LISTA DE FASES COM TAREFAS VISÍVEIS (LAYOUT MILESTONE) */}
              {contrato.fases && contrato.fases.length > 0 ? (
                <div className="space-y-4">
                  {contrato.fases
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((fase) => {
                      const etapasDaFase = fase.etapas || [];
                      const totalEtapas = etapasDaFase.length;
                      const concluidas = etapasDaFase.filter(e => (e.progresso || 0) >= 1.0).length;
                      const progressoFase = totalEtapas > 0 
                        ? Math.round((etapasDaFase.reduce((acc, e) => acc + (e.progresso || 0), 0) / totalEtapas) * 100) 
                        : 0;

                      const isExpanded = fasesExpandidas[fase.id] !== false; // Padrão aberta!

                      return (
                        <div key={fase.id} className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
                          
                          {/* Cabeçalho da Fase */}
                          <div 
                            onClick={() => toggleFase(fase.id)}
                            className="p-4 bg-slate-50/70 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-slate-400">
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </span>
                              
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase bg-[#2b2b27] text-white shrink-0">
                                Fase {fase.ordem}
                              </span>

                              <div className="flex items-center gap-2 min-w-0">
                                <h3 className="text-sm font-bold text-slate-900 truncate">{fase.nome_fase}</h3>
                                <span className="text-xs text-slate-400 shrink-0 font-medium">
                                  ({concluidas}/{totalEtapas} concluídas)
                                </span>
                              </div>
                            </div>
                            
                            {/* Progresso da Fase + Ações */}
                            <div className="flex items-center gap-3 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                              {/* Mini Barra de Progresso da Fase */}
                              <div className="hidden sm:flex items-center gap-2 w-28">
                                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all duration-300 bg-[#2b2b27]"
                                    style={{ width: `${progressoFase}%` }}
                                  ></div>
                                </div>
                                <span className="text-[11px] font-mono font-semibold text-slate-500 w-7 text-right">
                                  {progressoFase}%
                                </span>
                              </div>

                              {user?.role === 'admin' && (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => abrirModalCriarEtapa(fase.id)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-md text-xs font-semibold shadow-2xs transition cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3 text-[#2b2b27]" />
                                    Nova Etapa
                                  </button>
                                  <button
                                    onClick={() => abrirModalEditarFase(fase)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-md transition cursor-pointer"
                                    title="Editar Fase"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleExcluirFase(fase.id, fase.nome_fase)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                    title="Remover Fase"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* LISTA DE TAREFAS (EXPANDIDA DE FORMA ELEGANTE) */}
                          {isExpanded && (
                            <div className="p-3 sm:p-4 space-y-2.5 bg-white">
                              {etapasDaFase.length > 0 ? (
                                etapasDaFase.map((etapa) => {
                                  const progressoCem = Math.round((etapa.progresso || 0) * 100);
                                  const isDone = progressoCem === 100;

                                  return (
                                    <div 
                                      key={etapa.id} 
                                      className={`p-3.5 rounded-lg border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                                        isDone 
                                          ? 'bg-slate-50/50 border-slate-200/60' 
                                          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                                      }`}
                                    >
                                      {/* Checkbox de Status Rápido + Nome da Tarefa */}
                                      <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <button
                                          onClick={() => handleProgressoSlider(etapa, isDone ? 0 : 1.0)}
                                          title={isDone ? "Desfazer (marcar como pendente)" : "Marcar como concluída"}
                                          className={`mt-0.5 shrink-0 transition-colors cursor-pointer ${
                                            isDone ? 'text-[#2b2b27] hover:text-black' : 'text-slate-300 hover:text-slate-500'
                                          }`}
                                        >
                                          {isDone ? (
                                            <CheckCircle2 className="w-5 h-5 fill-[#f4f1ef]" />
                                          ) : (
                                            <Circle className="w-5 h-5" />
                                          )}
                                        </button>

                                        <div className="space-y-1 min-w-0 flex-1">
                                          <div className="flex items-center gap-2">
                                            <h4 className={`text-xs font-semibold truncate ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                              {etapa.nome_tarefa}
                                            </h4>
                                            {isDone && (
                                              <span className="inline-flex px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-[#f4f1ef] text-[#434340] border border-[#e9e5e0]">
                                                Concluído
                                              </span>
                                            )}
                                          </div>

                                          {etapa.observacoes && (
                                            <p className="text-[11px] text-slate-500 line-clamp-1">
                                              {etapa.observacoes}
                                            </p>
                                          )}

                                          {/* Metadados da Tarefa */}
                                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                                            <div className="flex items-center gap-1.5 font-medium">
                                              <div className="w-4 h-4 rounded-full bg-[#f4f1ef] text-[#161614] border border-[#e9e5e0] flex items-center justify-center font-bold text-[8px] uppercase">
                                                {obterIniciais(etapa.responsavel)}
                                              </div>
                                              <span className="text-slate-700">{etapa.responsavel}</span>
                                            </div>

                                            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                                              <Calendar className="w-3 h-3 text-slate-400" />
                                              <span>{formatarData(etapa.data_inicio)} &rarr; {formatarData(etapa.data_termino)}</span>
                                            </div>

                                            <span className="text-[11px] text-slate-400">
                                              ({etapa.dias_previstos} dias)
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Ações da Tarefa */}
                                      {user?.role === 'admin' && (
                                        <div className="flex items-center gap-1 self-end md:self-auto pl-2 border-t md:border-t-0 md:border-l border-slate-100 pt-2 md:pt-0">
                                          <button
                                            onClick={() => abrirModalEditarEtapa(etapa)}
                                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition cursor-pointer"
                                            title="Editar Etapa"
                                          >
                                            <Edit3 className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={() => handleExcluirEtapa(etapa.id, etapa.nome_tarefa)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                            title="Remover Etapa"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      )}

                                    </div>
                                  );
                                })
                              ) : (
                                <div className="py-6 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                                  Nenhuma etapa cadastrada nesta fase. Clique em "+ Nova Etapa".
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="py-12 bg-white border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
                  <FolderOpen className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-medium text-slate-500">Este contrato ainda não possui fases cadastradas.</p>
                  {user?.role === 'admin' && (
                    <button 
                      onClick={abrirModalCriarFase} 
                      className="mt-2 px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover transition cursor-pointer"
                    >
                      Cadastrar Primeira Fase
                    </button>
                  )}
                </div>
              )}

            </div>
          )}

          {/* ABA 2: HISTÓRICO & AUDITORIA */}
          {abaAtiva === 'historico' && (
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Trilha de Auditoria e Alterações
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registro cronológico de edições e atualizações no contrato
                </p>
              </div>

              {contrato.historicos && contrato.historicos.length > 0 ? (
                <div className="space-y-4 pl-4 border-l-2 border-slate-200 ml-2 pt-2">
                  {contrato.historicos.map((hist) => (
                    <div key={hist.id} className="relative space-y-1">
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white"></span>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-900">{hist.campo_alterado}</span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="text-slate-500 font-mono text-[11px]">{formatarDataHora(hist.alterado_em)}</span>
                      </div>

                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                        {hist.valor_anterior && (
                          <span className="text-slate-400 line-through mr-2">{hist.valor_anterior}</span>
                        )}
                        <span className="font-medium text-slate-800">{hist.valor_novo}</span>
                      </div>

                      <span className="text-[10px] text-slate-400 block">
                        Registrado por: <strong className="text-slate-600 font-medium">{hist.alterado_por}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 text-xs">
                  Nenhuma alteração registrada até o momento.
                </div>
              )}
            </div>
          )}

        </div>

        {/* ====================================================== */}
        {/* COLUNA DIREITA (30% - Painel Executivo / Ficha Técnica) */}
        {/* ====================================================== */}
        <div className="lg:col-span-4 space-y-5 sticky top-24">
          
          {/* CARD 1: SAÚDE DO CONTRATO & PROGRESSO */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Progresso Geral</span>
              <span className="text-xs font-mono font-bold text-slate-900">{progressoGeral}%</span>
            </div>

            {/* Barra de Progresso Fina */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  contrato.status === 'atrasado'
                    ? 'bg-[#E5392D]'
                    : 'bg-[#266DF0]'
                }`}
                style={{ width: `${progressoGeral}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              <span>Etapas finalizadas:</span>
              <strong className="text-slate-800 font-mono">{etapasConcluidasCount} de {totalEtapasCount}</strong>
            </div>

            {/* Box de Prazos Consolidado */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Prazo Final
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  {formatarData(contrato.data_entrega_final)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50">
                <span className="text-slate-500">Situação:</span>
                <div>
                  {contrato.status === 'concluido' ? (
                    <span className="text-[#0E7138] font-semibold font-mono">Finalizado</span>
                  ) : diasRestantes !== null ? (
                    diasRestantes < 0 ? (
                      <span className="text-[#B42318] font-semibold font-mono">Atrasado ({Math.abs(diasRestantes)}d)</span>
                    ) : diasRestantes <= 7 ? (
                      <span className="text-[#945300] font-semibold font-mono">Faltam {diasRestantes} dias</span>
                    ) : (
                      <span className="text-slate-700 font-medium font-mono">Faltam {diasRestantes} dias</span>
                    )
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: FICHA TÉCNICA DO PROJETO */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Ficha Técnica
              </h3>
              <span className="text-[10px] text-slate-400">Dados do Contrato</span>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Diretor do Projeto */}
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Diretor Responsável (RT)</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-5 h-5 rounded-full bg-[#EEF4FF] text-[#266DF0] border border-[#D4E2FF] flex items-center justify-center font-bold text-[9px] uppercase">
                    {obterIniciais(contrato.diretor_projeto)}
                  </div>
                  <span className="font-semibold text-slate-800">{contrato.diretor_projeto}</span>
                </div>
              </div>

              {/* Direitos Minerários / ANM */}
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Processo ANM / Direitos</span>
                <span className="font-mono font-semibold text-slate-800 mt-0.5 block">
                  {contrato.direitos_minerarios || 'Não informado'}
                </span>
              </div>

              {/* Dias de Campo */}
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Intensidade de Campo</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {contrato.dias_campo_total} dias de campo previstos
                </span>
              </div>

              {/* Datas de Período */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Início</span>
                  <span className="font-mono text-slate-700 font-medium">{formatarData(contrato.data_inicio)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Entrega Prevista</span>
                  <span className="font-mono text-slate-700 font-medium">{formatarData(contrato.data_entrega_final)}</span>
                </div>
              </div>

              {/* Observações / Escopo */}
              {contrato.observacoes && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px] font-medium mb-1">Escopo Técnico</span>
                  <p className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-slate-600 text-xs leading-relaxed">
                    {contrato.observacoes}
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 🛡️ MODAIS CORPORATIVOS (EDIÇÃO E INSERÇÃO) */}
      {/* ======================================================== */}

      {/* 1. MODAL EDITAR CONTRATO */}
      {modalContratoAberto && (
        <Modal
          title="Editar Informações Gerais do Contrato"
          icon={Edit3}
          maxWidth="max-w-2xl"
          onClose={() => setModalContratoAberto(false)}
        >
            <form onSubmit={handleSalvarContrato} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nome do Projeto *</label>
                  <input 
                    type="text" 
                    required
                    value={editContratoForm.nome_projeto || ''}
                    onChange={(e) => setEditContratoForm({...editContratoForm, nome_projeto: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cliente *</label>
                  <input 
                    type="text" 
                    required
                    value={editContratoForm.cliente || ''}
                    onChange={(e) => setEditContratoForm({...editContratoForm, cliente: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Empresa *</label>
                  <input 
                    type="text" 
                    required
                    value={editContratoForm.empresa || ''}
                    onChange={(e) => setEditContratoForm({...editContratoForm, empresa: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Diretor do Projeto *</label>
                  <select 
                    required
                    value={editContratoForm.diretor_projeto || ''}
                    onChange={(e) => setEditContratoForm({...editContratoForm, diretor_projeto: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 cursor-pointer"
                  >
                    {responsaveis.map(r => (
                      <option key={r.id} value={r.nome}>{r.nome} ({r.cargo})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Área *</label>
                  <select 
                    required
                    value={editContratoForm.area || ''}
                    onChange={(e) => setEditContratoForm({...editContratoForm, area: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 cursor-pointer"
                  >
                    <option value="Topografia">Topografia</option>
                    <option value="Geologia">Geologia</option>
                    <option value="Meio Ambiente">Meio Ambiente</option>
                    <option value="Outra">Outra</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Direitos Minerários</label>
                  <input 
                    type="text" 
                    value={editContratoForm.direitos_minerarios || ''}
                    onChange={(e) => setEditContratoForm({...editContratoForm, direitos_minerarios: e.target.value})}
                    placeholder="ex: 831.199/2025"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Dias de Campo Previstos</label>
                  <input 
                    type="number" 
                    value={editContratoForm.dias_campo_total || 0}
                    onChange={(e) => setEditContratoForm({...editContratoForm, dias_campo_total: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Data Início</label>
                  <input 
                    type="date" 
                    value={editContratoForm.data_inicio ? editContratoForm.data_inicio.split('T')[0] : ''}
                    onChange={(e) => setEditContratoForm({...editContratoForm, data_inicio: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Data Entrega Final</label>
                  <input 
                    type="date" 
                    value={editContratoForm.data_entrega_final ? editContratoForm.data_entrega_final.split('T')[0] : ''}
                    onChange={(e) => setEditContratoForm({...editContratoForm, data_entrega_final: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Observações Técnicas</label>
                  <textarea 
                    value={editContratoForm.observacoes || ''}
                    onChange={(e) => setEditContratoForm({...editContratoForm, observacoes: e.target.value})}
                    rows="3"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setModalContratoAberto(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Salvar Alterações
                </button>
              </div>
            </form>
        </Modal>
      )}

      {/* 2. MODAL ADICIONAR / EDITAR FASE */}
      {modalFaseAberto && (
        <Modal
          title={faseForm.id ? 'Editar Fase do Cronograma' : 'Nova Fase do Cronograma'}
          icon={faseForm.id ? Edit3 : Plus}
          maxWidth="max-w-md"
          onClose={() => setModalFaseAberto(false)}
        >
            <form onSubmit={handleSalvarFase} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nome da Fase *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Fase 1 - Planejamento e Mobilização"
                  value={faseForm.nome_fase}
                  onChange={(e) => setFaseForm({...faseForm, nome_fase: e.target.value})}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Ordem / Posição</label>
                <input 
                  type="number" 
                  value={faseForm.ordem}
                  onChange={(e) => setFaseForm({...faseForm, ordem: e.target.value})}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setModalFaseAberto(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {faseForm.id ? 'Salvar Alterações' : 'Criar Fase'}
                </button>
              </div>
            </form>
        </Modal>
      )}

      {/* 3. MODAL ADICIONAR / EDITAR ETAPA */}
      {modalEtapaAberto && (
        <Modal
          title={etapaForm.id ? 'Editar Etapa / Tarefa' : 'Adicionar Etapa / Tarefa'}
          icon={etapaForm.id ? Edit3 : Plus}
          maxWidth="max-w-xl"
          onClose={() => setModalEtapaAberto(false)}
        >
            <form onSubmit={handleSalvarEtapa} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nome da Tarefa *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Levantamento GNSS e Coleta de Dados"
                  value={etapaForm.nome_tarefa}
                  onChange={(e) => setEtapaForm({...etapaForm, nome_tarefa: e.target.value})}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Responsável *</label>
                  <select 
                    required
                    value={etapaForm.responsavel}
                    onChange={(e) => setEtapaForm({...etapaForm, responsavel: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent cursor-pointer"
                  >
                    {responsaveis.map(r => (
                      <option key={r.id} value={r.nome}>{r.nome} ({r.cargo})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Status</label>
                  <button
                    type="button"
                    onClick={() => setEtapaForm({...etapaForm, progresso: etapaForm.progresso === 100 ? 0 : 100})}
                    className={`mt-1 px-3 py-2 border rounded-lg text-xs font-semibold transition flex items-center gap-1.5 w-full justify-center cursor-pointer ${
                      etapaForm.progresso === 100 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {etapaForm.progresso === 100 ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Concluído (Alternar)
                      </>
                    ) : (
                      'Pendente (Marcar Concluído)'
                    )}
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Data Início</label>
                  <input 
                    type="date" 
                    value={etapaForm.data_inicio}
                    onChange={(e) => setEtapaForm({...etapaForm, data_inicio: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Data Término</label>
                  <input 
                    type="date" 
                    value={etapaForm.data_termino}
                    onChange={(e) => setEtapaForm({...etapaForm, data_termino: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Dias Previstos</label>
                  <input 
                    type="number" 
                    value={etapaForm.dias_previstos}
                    onChange={(e) => setEtapaForm({...etapaForm, dias_previstos: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Observações da Tarefa</label>
                <textarea 
                  value={etapaForm.observacoes}
                  onChange={(e) => setEtapaForm({...etapaForm, observacoes: e.target.value})}
                  rows="2"
                  placeholder="Instruções técnicas, equipamentos ou escopo desta tarefa..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setModalEtapaAberto(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {etapaForm.id ? 'Salvar Alterações' : 'Criar Tarefa'}
                </button>
              </div>
            </form>
        </Modal>
      )}

      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmacao && (
        <ConfirmDialog
          title={confirmacao.titulo}
          confirmLabel={confirmacao.rotulo}
          danger
          loading={confirmando}
          onConfirm={executarConfirmacao}
          onCancel={() => setConfirmacao(null)}
        >
          <p>{confirmacao.mensagem}</p>
        </ConfirmDialog>
      )}

    </div>
  );
};

export default DetalheContrato;

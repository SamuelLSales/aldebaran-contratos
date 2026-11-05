import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Briefcase, 
  Check, 
  AlertCircle,
  FileText,
  Clock,
  Calendar,
  Layers,
  MapPin
} from 'lucide-react';
import { createContrato, getResponsaveis } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const NovoContrato = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [responsaveis, setResponsaveis] = useState([]);
  const [diretores, setDiretores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estado do formulário
  const [form, setForm] = useState({
    nome_projeto: '',
    cliente: '',
    empresa: 'ProjectSight',
    direitos_minerarios: '',
    area: 'Topografia',
    diretor_projeto: '',
    data_inicio: '',
    data_entrega_final: '',
    dias_campo_total: 0,
    observacoes: ''
  });

  // Estado de validações inline
  const [erros, setErros] = useState({});

  useEffect(() => {
    const carregarDiretores = async () => {
      try {
        const lista = await getResponsaveis();
        setResponsaveis(lista);
        
        const filtrados = lista.filter(r => r.cargo?.toLowerCase() === 'diretor');
        setDiretores(filtrados);
        
        if (filtrados.length > 0) {
          setForm(prev => ({ ...prev, diretor_projeto: filtrados[0].nome }));
        } else if (lista.length > 0) {
          setForm(prev => ({ ...prev, diretor_projeto: lista[0].nome }));
        }
      } catch (err) {
        console.error('Erro ao carregar colaboradores:', err);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDiretores();
  }, []);

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!form.nome_projeto.trim()) novosErros.nome_projeto = 'Nome do projeto é obrigatório';
    if (!form.cliente.trim()) novosErros.cliente = 'Nome do cliente é obrigatório';
    if (!form.empresa.trim()) novosErros.empresa = 'Empresa responsável é obrigatória';
    if (!form.diretor_projeto) novosErros.diretor_projeto = 'Selecione um diretor para o projeto';
    
    if (form.data_inicio && form.data_entrega_final) {
      const inicio = new Date(form.data_inicio);
      const fim = new Date(form.data_entrega_final);
      if (fim < inicio) {
        novosErros.data_entrega_final = 'A data de entrega não pode ser anterior à data de início';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validarFormulario()) return;

    try {
      const payload = {
        ...form,
        data_inicio: form.data_inicio ? new Date(form.data_inicio).toISOString() : null,
        data_entrega_final: form.data_entrega_final ? new Date(form.data_entrega_final).toISOString() : null,
        dias_campo_total: parseInt(form.dias_campo_total) || 0
      };

      const contratoCriado = await createContrato(payload);
      navigate(`/contratos/${contratoCriado.id}`);
    } catch (err) {
      console.error('Erro ao salvar contrato:', err);
      setErrorMessage('Não foi possível salvar o contrato. Verifique os dados digitados ou a conexão do servidor.');
    }
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/contratos" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-xs">Carregando dados necessários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[960px] mx-auto animate-fade-in text-slate-900">
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold group cursor-pointer mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Voltar ao Dashboard
            </button>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="text-primary w-6 h-6" />
              Abertura de Novo Contrato
            </h1>
            <p className="text-slate-500 text-xs">
              Cadastre os dados técnicos para iniciar o acompanhamento do projeto
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg text-xs transition-all shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Criar Contrato
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 text-rose-800 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="text-rose-600 w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-rose-700 text-xs">{errorMessage}</p>
          </div>
        )}
        
        {/* SEÇÃO 1 — DADOS PRINCIPAIS */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-900">
              1. Identificação do Projeto
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome do Projeto */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Nome do Projeto *
              </label>
              <input 
                type="text"
                name="nome_projeto"
                value={form.nome_projeto}
                onChange={handleInputChange}
                placeholder="Ex: Mapeamento Geológico e Topografia Igaratinga MG"
                className={`w-full p-2.5 bg-white border ${erros.nome_projeto ? 'border-rose-500' : 'border-slate-300'} rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all`}
              />
              {erros.nome_projeto && <p className="text-rose-600 text-[11px] mt-1 font-medium">{erros.nome_projeto}</p>}
            </div>

            {/* Cliente */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Cliente / Contratante *
              </label>
              <input 
                type="text"
                name="cliente"
                value={form.cliente}
                onChange={handleInputChange}
                placeholder="Ex: Vale S.A., Mineração Morro do Ipê"
                className={`w-full p-2.5 bg-white border ${erros.cliente ? 'border-rose-500' : 'border-slate-300'} rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all`}
              />
              {erros.cliente && <p className="text-rose-600 text-[11px] mt-1 font-medium">{erros.cliente}</p>}
            </div>

            {/* Empresa Executora */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Empresa Executora *
              </label>
              <input 
                type="text"
                name="empresa"
                value={form.empresa}
                onChange={handleInputChange}
                className={`w-full p-2.5 bg-white border ${erros.empresa ? 'border-rose-500' : 'border-slate-300'} rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all`}
              />
              {erros.empresa && <p className="text-rose-600 text-[11px] mt-1 font-medium">{erros.empresa}</p>}
            </div>

            {/* Área de Atuação */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Área de Atuação *
              </label>
              <select 
                name="area"
                value={form.area}
                onChange={handleInputChange}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 cursor-pointer transition-all"
              >
                <option value="Topografia">Topografia</option>
                <option value="Geologia">Geologia</option>
                <option value="Meio Ambiente">Meio Ambiente</option>
                <option value="Outra">Outra</option>
              </select>
            </div>

            {/* Diretor Responsável */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Diretor Responsável pelo Projeto *
              </label>
              <select 
                name="diretor_projeto"
                value={form.diretor_projeto}
                onChange={handleInputChange}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 cursor-pointer transition-all"
              >
                {diretores.length > 0 ? (
                  diretores.map(d => (
                    <option key={d.id} value={d.nome}>{d.nome}</option>
                  ))
                ) : (
                  responsaveis.map(r => (
                    <option key={r.id} value={r.nome}>{r.nome} ({r.cargo})</option>
                  ))
                )}
              </select>
            </div>

            {/* Direitos Minerários */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Processo ANM / Direitos Minerários
              </label>
              <input 
                type="text"
                name="direitos_minerarios"
                value={form.direitos_minerarios}
                onChange={handleInputChange}
                placeholder="Ex: 831.199/2025"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>

            {/* Dias de Campo */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Previsão de Dias em Campo
              </label>
              <input 
                type="number"
                name="dias_campo_total"
                value={form.dias_campo_total}
                onChange={handleInputChange}
                min="0"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 2 — CRONOGRAMA INICIAL */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-900">
              2. Prazos e Cronograma Inicial
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data Início */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Data de Início das Atividades
              </label>
              <input 
                type="date"
                name="data_inicio"
                value={form.data_inicio}
                onChange={handleInputChange}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>

            {/* Data Entrega */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Data de Entrega Final Prevista
              </label>
              <input 
                type="date"
                name="data_entrega_final"
                value={form.data_entrega_final}
                onChange={handleInputChange}
                className={`w-full p-2.5 bg-white border ${erros.data_entrega_final ? 'border-rose-500' : 'border-slate-300'} rounded-lg text-xs text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all`}
              />
              {erros.data_entrega_final && <p className="text-rose-600 text-[11px] mt-1 font-medium">{erros.data_entrega_final}</p>}
            </div>

            {/* Observações */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Observações Técnicas / Escopo Inicial
              </label>
              <textarea 
                name="observacoes"
                rows="3"
                value={form.observacoes}
                onChange={handleInputChange}
                placeholder="Insira detalhes sobre ARTs, metodologia de levantamento, especificações técnicas..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-y"
              ></textarea>
            </div>
          </div>
        </div>

        {/* BOTÃO FINAL MOBILE */}
        <div className="sm:hidden pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Criar Contrato
          </button>
        </div>

      </form>
    </div>
  );
};

export default NovoContrato;

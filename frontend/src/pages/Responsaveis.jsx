import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2, UserX, ShieldAlert, Search } from 'lucide-react';
import {
  getResponsaveis,
  createResponsavel,
  updateResponsavel,
  deleteResponsavel,
  getContratos,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AreaBadge from '../components/AreaBadge';

const AREAS = ['Topografia', 'Geologia', 'Meio Ambiente', 'Administrativo', 'Todas'];

const AREA_LABEL = { Todas: 'Multiárea' };

const INPUT_CLASS =
  'w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20';

const pluralizar = (n, singular, plural) => `${n} ${n === 1 ? singular : plural}`;

const obterIniciais = (nome) => {
  if (!nome) return 'U';
  const partes = nome.trim().split(/\s+/);
  if (partes.length > 1) return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  return nome.slice(0, 2).toUpperCase();
};

const Responsaveis = () => {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'admin';

  const [responsaveis, setResponsaveis] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroArea, setFiltroArea] = useState('todos');

  // Modal de criação/edição
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ nome: '', cargo: 'Campo', area: 'Topografia' });
  const [erroForm, setErroForm] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Confirmação de exclusão
  const [aExcluir, setAExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [listaResponsaveis, listaContratos] = await Promise.all([
        getResponsaveis(),
        getContratos(),
      ]);
      setResponsaveis(listaResponsaveis);
      setContratos(listaContratos);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar colaboradores:', err);
      setError('Não foi possível conectar ao servidor. Verifique se o backend está em execução.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Contratos ativos e etapas vinculadas por colaborador (calculado uma única vez)
  const alocacao = useMemo(() => {
    const mapa = {};
    const get = (nome) => (mapa[nome] ||= { contratos: new Set(), etapas: 0 });

    contratos.forEach((c) => {
      const ativo = c.status !== 'concluido';
      if (ativo && c.diretor_projeto) get(c.diretor_projeto).contratos.add(c.id);

      c.fases?.forEach((f) =>
        f.etapas?.forEach((e) => {
          if (!e.responsavel) return;
          const aloc = get(e.responsavel);
          aloc.etapas++;
          if (ativo && (e.progresso || 0) < 1.0) aloc.contratos.add(c.id);
        })
      );
    });
    return mapa;
  }, [contratos]);

  const contratosAtivos = (nome) => alocacao[nome]?.contratos.size || 0;
  const etapasVinculadas = (nome) => alocacao[nome]?.etapas || 0;

  // Indicadores
  const totalEquipe = responsaveis.length;
  const comAlocacao = responsaveis.filter((r) => contratosAtivos(r.nome) > 0).length;
  const semAlocacao = totalEquipe - comAlocacao;

  // Contagem por área (exclusiva — cada pessoa conta em uma única área)
  const contagemPorArea = useMemo(() => {
    const c = {};
    responsaveis.forEach((r) => {
      c[r.area] = (c[r.area] || 0) + 1;
    });
    return c;
  }, [responsaveis]);

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return responsaveis.filter((r) => {
      if (filtroArea !== 'todos' && r.area !== filtroArea) return false;
      if (!termo) return true;
      return r.nome.toLowerCase().includes(termo) || (r.cargo || '').toLowerCase().includes(termo);
    });
  }, [responsaveis, busca, filtroArea]);

  // Operações
  const abrirCriarModal = () => {
    setEditandoId(null);
    setForm({ nome: '', cargo: 'Campo', area: 'Topografia' });
    setErroForm('');
    setModalAberto(true);
  };

  const abrirEditarModal = (colaborador) => {
    setEditandoId(colaborador.id);
    setForm({ nome: colaborador.nome, cargo: colaborador.cargo, area: colaborador.area });
    setErroForm('');
    setModalAberto(true);
  };

  const fecharModal = () => setModalAberto(false);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setErroForm('');

    if (!form.nome.trim()) {
      setErroForm('O nome do colaborador é obrigatório.');
      return;
    }

    try {
      setSalvando(true);
      if (editandoId) {
        await updateResponsavel(editandoId, form);
        toast.success('Colaborador atualizado com sucesso.');
      } else {
        await createResponsavel(form);
        toast.success('Colaborador cadastrado com sucesso.');
      }
      setModalAberto(false);
      carregarDados();
    } catch (err) {
      console.error('Erro ao salvar colaborador:', err);
      setErroForm(err.response?.data?.detail || 'Erro ao salvar colaborador. Verifique a conexão.');
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = async () => {
    try {
      setExcluindo(true);
      await deleteResponsavel(aExcluir.id);
      toast.success(`${aExcluir.nome} foi removido(a) da equipe.`);
      setAExcluir(null);
      carregarDados();
    } catch (err) {
      console.error('Erro ao excluir colaborador:', err);
      toast.error('Não foi possível excluir o colaborador.');
    } finally {
      setExcluindo(false);
    }
  };

  if (loading && responsaveis.length === 0) {
    return (
      <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto" aria-busy="true">
        <div className="h-8 w-72 bg-slate-200/70 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 bg-white border border-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-80 bg-white border border-slate-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  const indicadores = [
    { label: 'Colaboradores', valor: totalEquipe, apoio: 'cadastrados na equipe' },
    { label: 'Alocados', valor: comAlocacao, apoio: 'com contratos ativos' },
    { label: 'Disponíveis', valor: semAlocacao, apoio: 'sem contratos ativos' },
  ];

  const chips = [
    { id: 'todos', label: 'Todos', total: totalEquipe },
    ...AREAS.map((a) => ({ id: a, label: AREA_LABEL[a] || a, total: contagemPorArea[a] || 0 })),
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto animate-fade-in text-slate-900">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Equipe técnica</h1>
          <p className="text-sm text-slate-500 mt-1">
            Profissionais responsáveis por campo, escritório e coordenação dos contratos.
          </p>
        </div>

        {isAdmin && (
          <Button icon={Plus} onClick={abrirCriarModal} className="self-start sm:self-auto">
            Novo colaborador
          </Button>
        )}
      </div>

      {/* ERRO DE CONEXÃO */}
      {error && (
        <div
          role="alert"
          className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-4 flex items-start gap-3"
        >
          <ShieldAlert className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">{error}</div>
          <Button variant="secondary" size="sm" onClick={carregarDados}>
            Tentar novamente
          </Button>
        </div>
      )}

      {/* INDICADORES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {indicadores.map((i) => (
          <div key={i.label} className="bg-white border border-slate-200 rounded-lg p-5 shadow-card">
            <p className="text-sm font-medium text-slate-500">{i.label}</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1 tabular-nums">{i.valor}</p>
            <p className="text-xs text-slate-500 mt-1">{i.apoio}</p>
          </div>
        ))}
      </div>

      {/* TABELA */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-card overflow-hidden">
        {/* Barra de ferramentas */}
        <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar por área">
            {chips.map((c) => {
              const ativo = filtroArea === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFiltroArea(c.id)}
                  aria-pressed={ativo}
                  className={`h-8 px-3 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 cursor-pointer ${
                    ativo
                      ? 'bg-[#1C1D1F] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                  <span className={`ml-1.5 text-xs tabular-nums ${ativo ? 'text-white/80' : 'text-slate-500'}`}>{c.total}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou cargo"
              aria-label="Buscar colaborador"
              className={`${INPUT_CLASS} pl-9 h-9`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {listaFiltrada.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold tracking-wider text-slate-500">
                  <th scope="col" className="py-3 px-5">Colaborador</th>
                  <th scope="col" className="py-3 px-5">Cargo</th>
                  <th scope="col" className="py-3 px-5">Área</th>
                  <th scope="col" className="py-3 px-5">Contratos ativos</th>
                  {isAdmin && <th scope="col" className="py-3 px-5 text-right"><span className="sr-only">Ações</span></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {listaFiltrada.map((resp) => {
                  const ativos = contratosAtivos(resp.nome);
                  return (
                    <tr key={resp.id} className="group hover:bg-slate-50 transition-colors duration-150">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            aria-hidden="true"
                            className="w-8 h-8 rounded-full bg-[#EEF4FF] text-[#266DF0] border border-[#D4E2FF] flex items-center justify-center font-semibold text-xs select-none"
                          >
                            {obterIniciais(resp.nome)}
                          </div>
                          <span className="font-medium text-slate-900">{resp.nome}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-slate-600">{resp.cargo}</td>

                      <td className="py-3.5 px-5">
                        <AreaBadge area={resp.area} />
                      </td>

                      <td className="py-3.5 px-5 tabular-nums">
                        {ativos > 0 ? (
                          <span className="text-slate-900 font-medium">{pluralizar(ativos, 'contrato', 'contratos')}</span>
                        ) : (
                          <span className="text-slate-500">Disponível</span>
                        )}
                      </td>

                      {isAdmin && (
                        <td className="py-3.5 px-5 text-right">
                          <div className="inline-flex items-center gap-1 opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => abrirEditarModal(resp)}
                              aria-label={`Editar ${resp.nome}`}
                              title="Editar"
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40"
                            >
                              <Pencil className="w-[18px] h-[18px]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setAExcluir(resp)}
                              aria-label={`Remover ${resp.nome}`}
                              title="Remover"
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                            >
                              <Trash2 className="w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-center">
              <UserX className="w-6 h-6 text-slate-400" aria-hidden="true" />
              <p className="text-sm font-medium text-slate-700">
                {responsaveis.length === 0 ? 'Nenhum colaborador cadastrado' : 'Nenhum resultado para os filtros aplicados'}
              </p>
              <p className="text-sm text-slate-500">
                {responsaveis.length === 0
                  ? isAdmin ? 'Use “Novo colaborador” para começar.' : 'Peça a um administrador para cadastrar a equipe.'
                  : 'Ajuste a busca ou limpe o filtro de área.'}
              </p>
              {responsaveis.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setBusca('');
                    setFiltroArea('todos');
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          )}
        </div>

        {listaFiltrada.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            Exibindo {listaFiltrada.length} de {totalEquipe} colaboradores
          </div>
        )}
      </div>

      {/* MODAL: ADICIONAR / EDITAR */}
      {modalAberto && (
        <Modal
          title={editandoId ? 'Editar colaborador' : 'Novo colaborador'}
          icon={editandoId ? Pencil : Plus}
          onClose={fecharModal}
        >
          <form onSubmit={handleSalvar} noValidate>
            <div className="p-5 space-y-4">
              {erroForm && (
                <div role="alert" className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2 text-red-700 text-sm">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{erroForm}</p>
                </div>
              )}

              <div>
                <label htmlFor="resp-nome" className="text-sm font-medium text-slate-700 block mb-1.5">
                  Nome completo
                </label>
                <input
                  id="resp-nome"
                  type="text"
                  placeholder="Ex.: Maria da Silva"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className={INPUT_CLASS}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="resp-cargo" className="text-sm font-medium text-slate-700 block mb-1.5">
                    Cargo
                  </label>
                  <select
                    id="resp-cargo"
                    value={form.cargo}
                    onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                    className={`${INPUT_CLASS} cursor-pointer`}
                  >
                    <option value="Diretor">Diretor</option>
                    <option value="Coordenador">Coordenador</option>
                    <option value="Campo">Técnico de Campo</option>
                    <option value="Escritório">Técnico de Escritório</option>
                    <option value="Financeiro">Financeiro / Administrativo</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="resp-area" className="text-sm font-medium text-slate-700 block mb-1.5">
                    Área principal
                  </label>
                  <select
                    id="resp-area"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className={`${INPUT_CLASS} cursor-pointer`}
                  >
                    {AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a === 'Todas' ? 'Todas as áreas (multiárea)' : a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={fecharModal}>
                Cancelar
              </Button>
              <Button type="submit" loading={salvando}>
                {editandoId ? 'Salvar alterações' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
      {aExcluir && (
        <ConfirmDialog
          title="Remover colaborador"
          confirmLabel="Remover"
          danger
          loading={excluindo}
          onConfirm={confirmarExclusao}
          onCancel={() => setAExcluir(null)}
        >
          <p>
            Deseja remover <strong className="text-slate-900">{aExcluir.nome}</strong> da equipe técnica?
          </p>
          {etapasVinculadas(aExcluir.nome) > 0 && (
            <p className="mt-3 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900">
              Atenção: há {pluralizar(etapasVinculadas(aExcluir.nome), 'etapa vinculada', 'etapas vinculadas')} a esta
              pessoa. Elas ficarão sem responsável nominal.
            </p>
          )}
        </ConfirmDialog>
      )}
    </div>
  );
};

export default Responsaveis;

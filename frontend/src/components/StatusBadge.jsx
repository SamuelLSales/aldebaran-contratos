import React from 'react';

const STATUS = {
  no_prazo: { label: 'No prazo', box: 'bg-emerald-50 text-emerald-800', dot: 'bg-status-success' },
  atencao: { label: 'Atenção', box: 'bg-amber-50 text-amber-800', dot: 'bg-status-warning' },
  atrasado: { label: 'Atrasado', box: 'bg-red-50 text-red-800', dot: 'bg-status-danger' },
  concluido: { label: 'Concluído', box: 'bg-slate-100 text-slate-700', dot: 'bg-status-done' },
};

const normalizar = (status) => {
  if (!status) return 'no_prazo';
  const s = String(status)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  if (s.includes('concl')) return 'concluido';
  if (s.includes('aten')) return 'atencao';
  if (s.includes('atras')) return 'atrasado';
  if (s.includes('prazo')) return 'no_prazo';
  return s;
};

const StatusBadge = ({ status }) => {
  const atual = STATUS[normalizar(status)] || {
    label: status,
    box: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${atual.box}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${atual.dot}`} aria-hidden="true" />
      {atual.label}
    </span>
  );
};

export default StatusBadge;

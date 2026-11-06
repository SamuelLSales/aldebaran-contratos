import React from 'react';

const STATUS = {
  no_prazo: { label: 'No prazo', box: 'bg-[#EAFBF1] text-[#0E7138] border border-[#C6F0D8]', dot: 'bg-[#12A150]' },
  atencao: { label: 'Atenção', box: 'bg-[#FFF6E5] text-[#945300] border border-[#FDE2B3]', dot: 'bg-[#E08600]' },
  atrasado: { label: 'Atrasado', box: 'bg-[#FFF0EE] text-[#B42318] border border-[#FFD4CE]', dot: 'bg-[#E5392D]' },
  concluido: { label: 'Concluído', box: 'bg-[#F4F5F6] text-[#50535A] border border-[#E6E7EA]', dot: 'bg-[#6B6F76]' },
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

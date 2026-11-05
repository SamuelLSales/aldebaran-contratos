import React from 'react';

const AREAS = {
  topografia: { label: 'Topografia', dot: 'bg-sky-500' },
  geologia: { label: 'Geologia', dot: 'bg-amber-500' },
  'meio ambiente': { label: 'Meio Ambiente', dot: 'bg-emerald-500' },
  administrativo: { label: 'Administrativo', dot: 'bg-slate-400' },
  todas: { label: 'Multiárea', dot: 'bg-primary' },
};

/** Área de atuação: ponto colorido + texto, sem fundo (discreto em tabelas densas). */
const AreaBadge = ({ area }) => {
  const key = String(area || '').toLowerCase().trim();
  const atual = AREAS[key] || { label: area || '—', dot: 'bg-slate-400' };
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-700">
      <span className={`w-2 h-2 rounded-full ${atual.dot}`} aria-hidden="true" />
      {atual.label}
    </span>
  );
};

export default AreaBadge;


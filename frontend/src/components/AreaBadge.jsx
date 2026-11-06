import React from 'react';

const AREAS = {
  topografia: { label: 'Topografia', dot: 'bg-[#266DF0]' },
  geologia: { label: 'Geologia', dot: 'bg-[#36383D]' },
  'meio ambiente': { label: 'Meio Ambiente', dot: 'bg-[#12A150]' },
  administrativo: { label: 'Administrativo', dot: 'bg-[#878A92]' },
  todas: { label: 'Multiárea', dot: 'bg-[#1C1D1F]' },
};

/** Área de atuação estilo Attio: ponto sutil + texto escuro. */
const AreaBadge = ({ area }) => {
  const key = String(area || '').toLowerCase().trim();
  const atual = AREAS[key] || { label: area || '—', dot: 'bg-[#878A92]' };
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-700">
      <span className={`w-1.5 h-1.5 rounded-full ${atual.dot}`} aria-hidden="true" />
      {atual.label}
    </span>
  );
};

export default AreaBadge;


import React from 'react';

/** Faixas: <30% vermelho, 30–79% âmbar, ≥80% verde (cores de status do design system). */
const ProgressBar = ({ value, showText = true }) => {
  const cleanValue = Math.min(Math.max(Math.round(Number(value) || 0), 0), 100);

  let cor = 'bg-status-danger';
  if (cleanValue >= 80) cor = 'bg-status-success';
  else if (cleanValue >= 30) cor = 'bg-status-warning';

  return (
    <div className="w-full flex items-center gap-3">
      <div
        className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden"
        role="progressbar"
        aria-valuenow={cleanValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${cor}`}
          style={{ width: `${cleanValue}%` }}
        />
      </div>
      {showText && (
        <span className="text-xs font-medium tabular-nums text-slate-600 min-w-[34px] text-right">
          {cleanValue}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;

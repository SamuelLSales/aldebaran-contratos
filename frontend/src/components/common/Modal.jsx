import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Modal acessível: fecha com Esc ou clique no fundo, trava o foco dentro do diálogo
 * e devolve o foco ao elemento anterior ao fechar.
 */
const Modal = ({ title, icon: Icon, onClose, children, maxWidth = 'max-w-md' }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;

    const focusables = () =>
      dialog.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

    // Foco inicial: primeiro campo do formulário, senão o primeiro elemento focável
    const first = dialog.querySelector('input, select, textarea') || focusables()[0];
    first?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`bg-white border border-slate-200 rounded-xl w-full ${maxWidth} overflow-hidden shadow-xl`}
      >
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            {Icon && <Icon className="w-[18px] h-[18px] text-brand-primary" aria-hidden="true" />}
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;


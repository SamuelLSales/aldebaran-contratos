import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/** Substitui window.confirm. Foco inicial no botão de cancelar (ação segura). */
const ConfirmDialog = ({
  title,
  children,
  confirmLabel = 'Confirmar',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) => (
  <Modal title={title} icon={AlertTriangle} onClose={onCancel}>
    <div className="px-5 py-4 text-sm text-slate-600 leading-relaxed">{children}</div>
    <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2">
      <Button variant="secondary" onClick={onCancel} autoFocus>
        Cancelar
      </Button>
      <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;


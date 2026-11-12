import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};
export function ConfirmDialog({ open, title, children, confirmLabel, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog ref={ref} className="modal" aria-labelledby="confirm-dialog-title" onCancel={onCancel}>
      <h2 id="confirm-dialog-title">{title}</h2>
      <p>{children}</p>
      <div>
        <button type="button" autoFocus className="button quiet" onClick={onCancel}>
          취소
        </button>
        <button type="button" className="button primary" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}

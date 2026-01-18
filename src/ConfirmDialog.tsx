import React, { useEffect } from 'react';
import dialogStyles from './ConfirmDialog.module.css';
import appStyles from './App.module.css';

export type Theme = 'light' | 'dark';

export interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = React.forwardRef<HTMLDialogElement, ConfirmDialogProps>(
  ({ isOpen, message, onConfirm, onCancel }, ref) => {
    useEffect(() => {
      if (typeof ref !== 'function' && ref?.current) {
        if (isOpen) {
          ref.current.showModal();
        } else {
          ref.current.close();
        }
      }
    }, [isOpen, ref]);

    function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
      const dialog = e.currentTarget;
      if (e.target === dialog) {
        onCancel();
      }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
      if (e.key === 'Escape') {
        onCancel();
      }
    }

    const dialogClasses = dialogStyles.dialog;

    return (
      <dialog
        ref={ref}
        className={dialogClasses}
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
      >
        <div className={dialogStyles.dialogContent}>
          <p className={dialogStyles.dialogMessage}>{message}</p>
          <div className={dialogStyles.dialogActions}>
            <button
              className={`${appStyles.btn} ${dialogStyles.btnSecondary}`}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className={`${appStyles.btn} ${appStyles.btnDanger}`}
              onClick={onConfirm}
            >
              Continue
            </button>
          </div>
        </div>
      </dialog>
    );
  }
);

ConfirmDialog.displayName = 'ConfirmDialog';

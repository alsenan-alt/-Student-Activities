import React from 'react';
import Modal from './Modal';
import { WarningIcon } from './icons/WarningIcon';

interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onClose, onConfirm, title, message }) => {
  return (
    <Modal onClose={onClose} size="md">
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-red-500/10 p-3 rounded-full mb-4">
          <WarningIcon className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-red-400">{title}</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">{message}</p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] focus:ring-[var(--color-text-secondary)]"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] focus:ring-red-600"
          >
            تأكيد الحذف
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;

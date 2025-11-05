import React, { useState } from 'react';
import Modal from './Modal';
import { LockIcon } from './icons/LockIcon';

interface PasswordModalProps {
  onClose: () => void;
  onVerify: (password: string) => boolean;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onVerify }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = onVerify(password);
    if (!isCorrect) {
      setError('كلمة المرور غير صحيحة. حاول مرة أخرى.');
      setPassword('');
    } else {
        setError('');
        // onClose is called from the parent component on successful verification
    }
  };

  const handleClose = () => {
    // Clear state before closing to prevent lingering data
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Modal onClose={handleClose} size="md">
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-[var(--color-bg)] p-3 rounded-full mb-4">
          <LockIcon className="w-8 h-8 text-[var(--color-accent)]" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-[var(--color-accent)]">مطلوب المصادقة</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">الرجاء إدخال كلمة مرور المسؤول للمتابعة.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="sr-only">
              كلمة المرور
            </label>
            <input
              id="admin-password"
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-center px-4 py-3 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] focus:ring-[var(--color-text-secondary)]"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[var(--color-accent)] text-white font-semibold rounded-md hover:brightness-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] focus:ring-[var(--color-accent)]"
            >
              دخول
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PasswordModal;

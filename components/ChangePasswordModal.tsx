import React, { useState } from 'react';
import Modal from './Modal';
import { KeyIcon } from './icons/KeyIcon';

interface ChangePasswordModalProps {
  onClose: () => void;
  onChangePassword: (current: string, newPass: string) => string | null;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('الرجاء ملء جميع الحقول.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور الجديدتان غير متطابقتين.');
      return;
    }
    
    if (newPassword.length < 6) {
        setError('يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.');
        return;
    }

    const resultError = onChangePassword(currentPassword, newPassword);
    if (resultError) {
      setError(resultError);
    }
  };

  const handleClose = () => {
    // Clear all state before closing to prevent lingering data
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  return (
    <Modal onClose={handleClose}>
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-[var(--color-bg)] p-3 rounded-full mb-4">
          <KeyIcon className="w-8 h-8 text-[var(--color-accent)]" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-[var(--color-accent)]">تغيير كلمة المرور</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">أدخل كلمة المرور الحالية والجديدة.</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div>
            <label htmlFor="current-password"  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              كلمة المرور الحالية
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="new-password"  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              كلمة المرور الجديدة
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
            />
          </div>
          <div>
            <label htmlFor="confirm-password"  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
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
              تحديث
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
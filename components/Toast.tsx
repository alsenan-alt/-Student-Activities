import React, { useEffect, useState } from 'react';
import type { ToastMessage } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { XIcon } from './icons/XIcon';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const icons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
  error: <XCircleIcon className="w-6 h-6 text-red-400" />,
  info: <CheckCircleIcon className="w-6 h-6 text-blue-400" />,
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onDismiss]);
  
  const handleDismiss = () => {
    setIsExiting(true);
    const exitTimer = setTimeout(() => onDismiss(toast.id), 300); // Match animation duration
  };

  const animationClass = isExiting ? 'animate-fade-out' : 'animate-fade-in-right';

  return (
    <div
      className={`relative flex items-center w-full max-w-sm p-4 my-2 text-[var(--color-text-primary)] bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg shadow-lg ${animationClass}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
        {icons[toast.type]}
      </div>
      <div className="ms-3 text-sm font-normal">{toast.message}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-[var(--color-border)] inline-flex items-center justify-center h-8 w-8"
        aria-label="Close"
        onClick={handleDismiss}
      >
        <span className="sr-only">Close</span>
        <XIcon className="w-3 h-3" />
      </button>
    </div>
  );
};

export default Toast;
import React, { useEffect, useRef } from 'react';
import { XIcon } from './icons/XIcon';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  size?: 'md' | 'lg' | '2xl' | '4xl' | '5xl';
}

const Modal: React.FC<ModalProps> = ({ onClose, children, size = 'lg' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };
    
    // Use timeout to prevent immediate close on button click that opens the modal
    const timerId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
    }, 0);


    return () => {
      clearTimeout(timerId);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className={`modal-box bg-[var(--color-card-bg)] rounded-lg shadow-xl p-6 w-full ${sizeClasses[size]} relative animate-fade-in-up`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors print-hide"
          aria-label="إغلاق"
        >
          <XIcon className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

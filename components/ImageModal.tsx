import React, { useEffect } from 'react';
import { XIcon } from './icons/XIcon';

interface ImageModalProps {
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, altText, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in-up"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 p-2 bg-black/20 rounded-full"
        aria-label="إغلاق"
      >
        <XIcon className="w-8 h-8" />
      </button>

      <div className="relative max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-contain shadow-2xl rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;

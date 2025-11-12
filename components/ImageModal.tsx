import React, { useEffect } from 'react';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

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
        aria-label="رجوع"
      >
        <ArrowRightIcon className="w-8 h-8" />
      </button>

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-[95vw] max-h-[90vh] object-contain shadow-2xl rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;
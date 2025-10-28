import React from 'react';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { LinkIcon } from './icons/LinkIcon';

interface ViewSwitcherProps {
  activeView: 'links' | 'announcements';
  onSwitch: (view: 'links' | 'announcements') => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ activeView, onSwitch }) => {
  return (
    <div className="flex p-1 bg-[var(--color-card-bg)] rounded-full border border-[var(--color-border)]">
      <button
        onClick={() => onSwitch('announcements')}
        className={`flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-full focus:outline-none transition-all duration-300 ${
          activeView === 'announcements'
            ? 'bg-[var(--color-accent)] text-white shadow-md'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
        }`}
      >
        <MegaphoneIcon className="w-5 h-5" />
        <span>الإعلانات</span>
      </button>
      <button
        onClick={() => onSwitch('links')}
        className={`flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-full focus:outline-none transition-all duration-300 ${
          activeView === 'links'
            ? 'bg-[var(--color-accent)] text-white shadow-md'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
        }`}
      >
        <LinkIcon className="w-5 h-5" />
        <span>الروابط</span>
      </button>
    </div>
  );
};

export default ViewSwitcher;

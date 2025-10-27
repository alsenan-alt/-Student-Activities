import React from 'react';

interface ViewSwitcherProps {
  activeView: 'links' | 'announcements';
  onSwitch: (view: 'links' | 'announcements') => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ activeView, onSwitch }) => {
  return (
    <div className="flex p-1 bg-[var(--color-card-bg)] rounded-full border border-[var(--color-border)]">
      <button
        onClick={() => onSwitch('announcements')}
        className={`px-6 py-2 text-sm font-semibold rounded-full focus:outline-none transition-colors duration-300 ${
          activeView === 'announcements'
            ? 'bg-[var(--color-accent)] text-white'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
        }`}
      >
        إعلانات الأندية
      </button>
      <button
        onClick={() => onSwitch('links')}
        className={`px-6 py-2 text-sm font-semibold rounded-full focus:outline-none transition-colors duration-300 ${
          activeView === 'links'
            ? 'bg-[var(--color-accent)] text-white'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
        }`}
      >
        الروابط
      </button>
    </div>
  );
};

export default ViewSwitcher;
import React from 'react';
import SearchBar from './SearchBar';
import ToggleSwitch from './ToggleSwitch';
import { UserMaleIcon } from './icons/UserMaleIcon';
import { UserFemaleIcon } from './icons/UserFemaleIcon';

interface AnnouncementFiltersProps {
  category: 'male' | 'female';
  onCategoryChange: (category: 'male' | 'female') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showTodays: boolean;
  onShowTodaysChange: (show: boolean) => void;
}

const AnnouncementFilters: React.FC<AnnouncementFiltersProps> = ({
  category,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  showTodays,
  onShowTodaysChange,
}) => {
  return (
    <div className="flex flex-col items-center gap-6 mb-8">
      <div className="flex p-1 bg-[var(--color-card-bg)] rounded-full border border-[var(--color-border)]">
        <button
          onClick={() => onCategoryChange('male')}
          className={`flex items-center justify-center gap-2 w-32 py-2 text-sm font-semibold rounded-full focus:outline-none transition-all duration-300 ${
            category === 'male'
              ? 'bg-[var(--color-accent)] text-white shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <UserMaleIcon className="w-5 h-5" />
          <span>طلاب</span>
        </button>
        <button
          onClick={() => onCategoryChange('female')}
          className={`flex items-center justify-center gap-2 w-32 py-2 text-sm font-semibold rounded-full focus:outline-none transition-all duration-300 ${
            category === 'female'
              ? 'bg-[var(--color-accent)] text-white shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <UserFemaleIcon className="w-5 h-5" />
          <span>طالبات</span>
        </button>
      </div>

      <SearchBar value={searchQuery} onChange={onSearchChange} placeholder="ابحث عن إعلان..." />

      <ToggleSwitch
        label="إعلانات اليوم فقط"
        enabled={showTodays}
        onChange={onShowTodaysChange}
      />
    </div>
  );
};

export default AnnouncementFilters;

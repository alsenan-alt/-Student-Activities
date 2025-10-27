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
      <div className="relative flex w-full max-w-xs p-1 bg-[var(--color-card-bg)] rounded-full">
        <span
          className={`absolute top-1 bottom-1 w-1/2 bg-[var(--color-accent)] rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
            category === 'female' ? 'translate-x-full' : 'translate-x-0'
          }`}
          aria-hidden="true"
        />
        <button onClick={() => onCategoryChange('male')} className="relative z-10 w-1/2 py-2 text-sm font-semibold text-center text-white rounded-full focus:outline-none flex items-center justify-center gap-2">
            <UserMaleIcon className="w-5 h-5" />
            <span>طلاب</span>
        </button>
        <button onClick={() => onCategoryChange('female')} className="relative z-10 w-1/2 py-2 text-sm font-semibold text-center text-white rounded-full focus:outline-none flex items-center justify-center gap-2">
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
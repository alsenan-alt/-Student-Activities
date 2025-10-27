import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4">
        <SearchIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />
      </div>
      <input
        type="text"
        placeholder={placeholder || "ابحث..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full p-3 ps-11 text-base text-[var(--color-text-primary)] border-2 border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors"
      />
    </div>
  );
};

export default SearchBar;
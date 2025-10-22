import React from 'react';
import type { UserRole } from '../types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="flex justify-center mb-10">
      <div className="relative flex w-full max-w-xs p-1 bg-[var(--color-card-bg)] rounded-full">
        <span
          className={`absolute top-1 bottom-1 w-1/2 bg-[var(--color-accent)] rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
            currentRole === 'admin' ? 'translate-x-full' : 'translate-x-0'
          }`}
          aria-hidden="true"
        />
        <button
          onClick={() => onRoleChange('student')}
          className="relative z-10 w-1/2 py-2 text-sm font-semibold text-center text-white rounded-full focus:outline-none transition-colors"
          aria-pressed={currentRole === 'student'}
        >
          عرض كطالب
        </button>
        <button
          onClick={() => onRoleChange('admin')}
          className="relative z-10 w-1/2 py-2 text-sm font-semibold text-center text-white rounded-full focus:outline-none transition-colors"
          aria-pressed={currentRole === 'admin'}
        >
          عرض كمسؤول
        </button>
      </div>
    </div>
  );
};

export default RoleSwitcher;
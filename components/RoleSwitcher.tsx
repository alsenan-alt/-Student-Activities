import React from 'react';
import type { UserRole } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { KeyIcon } from './icons/KeyIcon';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  const activeTextStyle = 'text-white';
  const inactiveTextStyle = 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]';

  return (
    <div className="flex justify-center mb-10">
      <div className="relative flex w-full max-w-sm p-1 bg-[var(--color-card-bg)] rounded-full">
        <span
          className={`absolute top-1 bottom-1 w-1/2 bg-[var(--color-accent)] rounded-full shadow-lg transform transition-transform duration-300 ease-in-out ${
            currentRole === 'admin' ? 'translate-x-full' : 'translate-x-0'
          }`}
          aria-hidden="true"
        />
        <button
          onClick={() => onRoleChange('student')}
          className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold rounded-full focus:outline-none flex items-center justify-center gap-2 transition-colors duration-300 ${
            currentRole === 'student' ? activeTextStyle : inactiveTextStyle
          }`}
          aria-pressed={currentRole === 'student'}
        >
          <UsersIcon className="w-5 h-5" />
          <span>عرض كطالب</span>
        </button>
        <button
          onClick={() => onRoleChange('admin')}
          className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold rounded-full focus:outline-none flex items-center justify-center gap-2 transition-colors duration-300 ${
            currentRole === 'admin' ? activeTextStyle : inactiveTextStyle
          }`}
          aria-pressed={currentRole === 'admin'}
        >
          <KeyIcon className="w-5 h-5" />
          <span>عرض كمسؤول</span>
        </button>
      </div>
    </div>
  );
};

export default RoleSwitcher;

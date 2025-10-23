import React from 'react';
import type { LinkItem, UserRole } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { getIconComponent } from './icons/iconMap';
import { PencilIcon } from './icons/PencilIcon';
import { DragHandleIcon } from './icons/DragHandleIcon';

interface LinkCardProps {
  link: LinkItem;
  onDelete: (id: number) => void;
  onEdit: (link: LinkItem) => void;
  userRole: UserRole;
  isDraggable: boolean;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete, onEdit, userRole, isDraggable }) => {
  const IconComponent = getIconComponent(link.icon);

  return (
    <div className="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 shadow-lg transition-all duration-300 ease-in-out hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-card-bg)] hover:brightness-110 hover:-translate-y-1">
      <div 
        className="absolute -inset-px rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-25 blur-xl" 
        aria-hidden="true"
      ></div>
      
      <div className="relative flex items-center gap-4">
        {isDraggable && (
            <div className="cursor-grab text-[var(--color-text-secondary)] p-2 flex-shrink-0" title="اسحب لإعادة الترتيب">
                <DragHandleIcon className="w-5 h-5" />
            </div>
        )}
        <div className="flex-shrink-0 bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
            <IconComponent className="w-6 h-6 text-[var(--color-accent)] transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="flex-1 min-w-0">
            <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-300 truncate"
                title={link.title}
            >
                {link.title}
            </a>
            {link.description && (
                <p className="text-sm text-[var(--color-text-secondary)] mt-1 truncate" title={link.description}>
                    {link.description}
                </p>
            )}
        </div>
        {userRole === 'admin' && (
          <div className="flex-shrink-0 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEdit(link)}
              className="text-[var(--color-text-secondary)] hover:text-blue-500 transition-all duration-300 p-2 rounded-full hover:bg-blue-500/10 scale-90 group-hover:scale-100"
              aria-label={`تعديل رابط ${link.title}`}
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(link.id)}
              className="text-[var(--color-text-secondary)] hover:text-red-500 transition-all duration-300 p-2 rounded-full hover:bg-red-500/10 scale-90 group-hover:scale-100"
              aria-label={`حذف رابط ${link.title}`}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkCard;
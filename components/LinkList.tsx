import React, { useRef } from 'react';
import type { LinkItem, UserRole } from '../types';
import LinkCard from './LinkCard';

interface LinkListProps {
  links: LinkItem[];
  onDelete: (id: number) => void;
  onEdit: (link: LinkItem) => void;
  onReorder: (reorderedLinks: LinkItem[]) => void;
  userRole: UserRole;
  searchQuery: string;
}

// FIX: The component was truncated, leading to syntax errors and a missing default export.
// The full implementation with drag-and-drop reordering is provided below.
const LinkList: React.FC<LinkListProps> = ({ links, onDelete, onEdit, onReorder, userRole, searchQuery }) => {
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItemIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow dropping.
  };

  const handleDrop = () => {
    if (dragItemIndex.current === null || dragOverItemIndex.current === null || dragItemIndex.current === dragOverItemIndex.current) {
        dragItemIndex.current = null;
        dragOverItemIndex.current = null;
        return;
    }

    const reorderedLinks = [...links];
    const [draggedItem] = reorderedLinks.splice(dragItemIndex.current, 1);
    reorderedLinks.splice(dragOverItemIndex.current, 0, draggedItem);
    
    onReorder(reorderedLinks);

    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  };
  
  const handleDragEnd = () => {
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  }

  const isDraggable = userRole === 'admin';

  if (links.length === 0) {
    return (
      <div className="text-center py-10 px-6 rounded-lg bg-[var(--color-card-bg)] border border-dashed border-[var(--color-border)]">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {searchQuery ? `لا توجد نتائج بحث لـ "${searchQuery}"` : 'لا توجد روابط حتى الآن.'}
        </h3>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {searchQuery ? 'حاول البحث بكلمات مختلفة.' : 'قم بإضافة رابط جديد لبدء القائمة.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link, index) => (
        <div
            key={link.id}
            draggable={isDraggable}
            onDragStart={() => isDraggable && handleDragStart(index)}
            onDragEnter={() => isDraggable && handleDragEnter(index)}
            onDragOver={handleDragOver}
            onDrop={isDraggable ? handleDrop : undefined}
            onDragEnd={isDraggable ? handleDragEnd : undefined}
            className={`transition-all duration-200 ${isDraggable ? 'cursor-move' : ''}`}
        >
            <LinkCard 
                link={link} 
                onDelete={onDelete} 
                onEdit={onEdit} 
                userRole={userRole}
                isDraggable={isDraggable}
            />
        </div>
      ))}
    </div>
  );
};

export default LinkList;

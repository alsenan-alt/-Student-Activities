import React, { useRef, useState } from 'react';
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

const LinkList: React.FC<LinkListProps> = ({ links, onDelete, onEdit, onReorder, userRole, searchQuery }) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragItemNode = useRef<HTMLDivElement | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const isDraggable = userRole === 'admin' && !searchQuery;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    dragItemNode.current = e.target as HTMLDivElement;
    dragItemNode.current.addEventListener('dragend', handleDragEnd);
    // Use a timeout to allow the browser to render the drag image before changing the style
    setTimeout(() => {
        setDraggingIndex(index);
    }, 0);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (dragItemNode.current !== e.target) {
        dragOverItem.current = index;
    }
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
        let _links = [...links];
        const draggedItemContent = _links.splice(dragItem.current, 1)[0];
        _links.splice(dragOverItem.current, 0, draggedItemContent);
        onReorder(_links);
    }
    
    if (dragItemNode.current) {
        dragItemNode.current.removeEventListener('dragend', handleDragEnd);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    dragItemNode.current = null;
    setDraggingIndex(null);
  };


  if (links.length === 0) {
    if (searchQuery) {
        return (
            <div className="text-center py-12 px-6 bg-[var(--color-card-bg)]/50 rounded-lg">
                <h3 className="text-xl text-[var(--color-text-secondary)]">لا توجد نتائج بحث</h3>
                <p className="text-[var(--color-text-secondary)]/80 mt-2">
                    لم يتم العثور على روابط تطابق بحثك عن "{searchQuery}".
                </p>
            </div>
        );
    }
    
    return (
      <div className="text-center py-12 px-6 bg-[var(--color-card-bg)]/50 rounded-lg">
        <h3 className="text-xl text-[var(--color-text-secondary)]">لا توجد روابط حالياً</h3>
        <p className="text-[var(--color-text-secondary)]/80 mt-2">
            {userRole === 'admin' 
                ? 'ابدأ بإضافة رابط جديد.' 
                : 'لا توجد روابط متاحة حاليًا. يرجى المراجعة لاحقًا.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {links.map((link, index) => (
        <div
            key={link.id}
            draggable={isDraggable}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragOver={(e) => e.preventDefault()}
            className={`transition-opacity duration-300 ${draggingIndex === index ? 'opacity-40' : 'opacity-100'}`}
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
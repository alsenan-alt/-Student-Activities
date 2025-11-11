import React from 'react';
import type { Announcement, UserRole } from '../types';
import AnnouncementCard from './AnnouncementCard';

interface AnnouncementListProps {
  announcements: Announcement[];
  userRole: UserRole;
  onDelete: (id: number) => void;
  onEdit: (announcement: Announcement) => void;
  onImageClick: (imageUrl: string) => void;
  searchQuery: string;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({ announcements, userRole, onDelete, onEdit, onImageClick, searchQuery }) => {
  if (announcements.length === 0) {
    return (
      <div className="text-center py-10 px-6 rounded-lg bg-[var(--color-card-bg)] border border-dashed border-[var(--color-border)]">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {searchQuery ? `لا توجد نتائج بحث لـ "${searchQuery}"` : 'لا توجد إعلانات متاحة حالياً.'}
        </h3>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {searchQuery ? 'حاول البحث بكلمات مختلفة.' : 'يرجى التحقق مرة أخرى لاحقاً أو إضافة إعلان جديد إذا كنت مسؤولاً.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 announcement-list-container">
      {announcements.map((ann) => (
        <AnnouncementCard
          key={ann.id}
          announcement={ann}
          userRole={userRole}
          onDelete={onDelete}
          onEdit={onEdit}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
};

export default AnnouncementList;
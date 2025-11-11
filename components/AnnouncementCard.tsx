import React from 'react';
import type { Announcement, UserRole } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import { ClockIcon } from './icons/ClockIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import Countdown from './Countdown';
import { LockIcon } from './icons/LockIcon';
import { UsersIcon } from './icons/UsersIcon';

interface AnnouncementCardProps {
  announcement: Announcement;
  userRole: UserRole;
  onDelete: (id: number) => void;
  onEdit: (announcement: Announcement) => void;
  onImageClick: (imageUrl: string) => void;
}

const categoryStyles = {
    male: {
        tagBg: 'bg-blue-500/90',
        hoverBorder: 'hover:border-blue-500/50',
        hoverShadow: 'hover:shadow-xl hover:shadow-blue-900/20',
        accentText: 'text-blue-400',
        buttonBg: '#3b82f6',
        buttonShadow: 'shadow-lg shadow-blue-500/20'
    },
    female: {
        tagBg: 'bg-pink-500/90',
        hoverBorder: 'hover:border-pink-500/50',
        hoverShadow: 'hover:shadow-xl hover:shadow-pink-900/20',
        accentText: 'text-pink-400',
        buttonBg: '#ec4899',
        buttonShadow: 'shadow-lg shadow-pink-500/20'
    },
    all: {
        tagBg: 'bg-purple-500/90',
        hoverBorder: 'hover:border-purple-500/50',
        hoverShadow: 'hover:shadow-xl hover:shadow-purple-900/20',
        accentText: 'text-purple-400',
        buttonBg: '#a855f7',
        buttonShadow: 'shadow-lg shadow-purple-500/20'
    },
};

const getCategoryText = (category: 'male' | 'female' | 'all') => {
    switch (category) {
        case 'male': return 'طلاب';
        case 'female': return 'طالبات';
        case 'all': return 'الجميع';
        default: return '';
    }
};

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, userRole, onDelete, onEdit, onImageClick }) => {
    const eventDate = new Date(announcement.date);
    const formattedDate = eventDate.toLocaleDateString('ar-EG', { day: '2-digit', month: 'long', year: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit', hour12: true });

    const styles = categoryStyles[announcement.category];
    const categoryText = getCategoryText(announcement.category);
    const displayImageUrl = announcement.imageDataUrl || announcement.imageUrl;

    return (
    <div 
        className={`group bg-[var(--color-card-bg)] rounded-xl shadow-lg overflow-hidden transition-all duration-300 border border-[var(--color-border)] ${styles.hoverBorder} ${styles.hoverShadow} announcement-card-print-container animate-fade-in-up`}
    >
      <div className="relative">
          <img 
              src={displayImageUrl}
              alt={`إعلان لـ ${announcement.title}`}
              className="w-full h-40 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
              onClick={() => onImageClick(displayImageUrl)}
              loading="lazy"
              decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
            <span className={`text-white text-xs font-bold px-3 py-1 rounded-full ${styles.tagBg}`}>
                {categoryText}
            </span>
            {userRole === 'admin' && (
                <div className="flex items-center gap-1 print-hide">
                    <button
                        onClick={() => onEdit(announcement)}
                        className="text-[var(--color-text-secondary)] hover:text-blue-400 transition-colors duration-200 p-1.5"
                        aria-label={`تعديل إعلان ${announcement.title}`}
                        title="تعديل"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onDelete(announcement.id)}
                        className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors duration-200 p-1.5"
                        aria-label={`حذف إعلان ${announcement.title}`}
                        title="حذف"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
        
        <h3 className={`text-xl font-bold mb-2 ${styles.accentText} transition-colors duration-300`} style={{fontFamily: "'Tajawal', sans-serif"}}>
            {announcement.title}
        </h3>
        
        {announcement.clubName && (
            <div className="flex items-center justify-end gap-2 text-sm text-[var(--color-text-secondary)] mb-4">
                <span>{announcement.clubName}</span>
                <UsersIcon className="w-4 h-4" />
            </div>
        )}

        <div className="flex items-center justify-end flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-text-secondary)] border-y border-dashed border-[var(--color-border)] py-3 my-4">
            <div className="flex items-center gap-2">
                <span>{announcement.location}</span>
                <LocationMarkerIcon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
                <span>{formattedTime}</span>
                <ClockIcon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
                <span>{formattedDate}</span>
                <CalendarDaysIcon className="w-5 h-5" />
            </div>
        </div>
        
        <div className="my-6">
            <p className="text-xs font-semibold text-center text-[var(--color-text-secondary)] mb-2">الوقت المتبقي للفعالية</p>
            <Countdown targetDate={announcement.date} onComplete={() => {}} cardAccentColor={styles.buttonBg} />
        </div>

        <div className="mt-4">
            {announcement.registrationType === 'link' && announcement.registrationUrl ? (
                <a 
                    href={announcement.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: styles.buttonBg }}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-white font-bold rounded-lg hover:brightness-110 transition-all text-base ${styles.buttonShadow}`}
                >
                    <span>رابط التسجيل</span>
                </a>
            ) : (
                <div className="w-full text-center px-4 py-2 border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-md flex items-center justify-center gap-2">
                    <LockIcon className="w-5 h-5" />
                    <span>بدون تسجيل (متاح)</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;

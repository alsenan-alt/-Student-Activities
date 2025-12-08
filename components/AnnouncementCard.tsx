
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
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { MagnifyingGlassPlusIcon } from './icons/MagnifyingGlassPlusIcon';

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
        hoverShadow: 'hover:shadow-2xl hover:shadow-blue-900/25',
        accentText: 'text-blue-400',
        buttonBg: '#3b82f6',
        buttonShadow: 'shadow-lg shadow-blue-500/20'
    },
    female: {
        tagBg: 'bg-pink-500/90',
        hoverBorder: 'hover:border-pink-500/50',
        hoverShadow: 'hover:shadow-2xl hover:shadow-pink-900/25',
        accentText: 'text-pink-400',
        buttonBg: '#ec4899',
        buttonShadow: 'shadow-lg shadow-pink-500/20'
    },
    all: {
        tagBg: 'bg-purple-500/90',
        hoverBorder: 'hover:border-purple-500/50',
        hoverShadow: 'hover:shadow-2xl hover:shadow-purple-900/25',
        accentText: 'text-purple-400',
        buttonBg: '#a855f7',
        buttonShadow: 'shadow-lg shadow-purple-500/20'
    },
};

const getCategoryText = (category: 'male' | 'female' | 'all') => {
    switch (category) {
        case 'male': return 'طلاب';
        case 'female': return 'طالبات';
        case 'all': return 'طلاب وطالبات';
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
        className={`group bg-[var(--color-card-bg)] rounded-xl shadow-md overflow-hidden transition-all duration-300 border border-[var(--color-border)] ${styles.hoverBorder} ${styles.hoverShadow} hover:-translate-y-1 announcement-card-print-container animate-fade-in-up`}
    >
      <div className="relative cursor-pointer" onClick={() => onImageClick(displayImageUrl)}>
          <img 
              src={displayImageUrl}
              alt={`إعلان لـ ${announcement.title}`}
              className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <MagnifyingGlassPlusIcon className="w-12 h-12 text-white transform group-hover:scale-110 transition-transform duration-300" />
          </div>
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
        
        <h3 className={`text-xl font-bold mb-2 ${styles.accentText} transition-all duration-300 group-hover:brightness-125`} style={{fontFamily: "'Tajawal', sans-serif"}}>
            {announcement.title}
        </h3>
        
        {(announcement.clubName || announcement.clubName2) && (
            <div className="flex items-start justify-end gap-2 text-sm text-[var(--color-text-secondary)] mb-4">
                <div className="flex flex-col items-end w-full">
                    {announcement.clubName && (
                        <span className="truncate max-w-full font-bold text-[var(--color-text-primary)]" title={announcement.clubName}>
                            {announcement.clubName}
                        </span>
                    )}
                    {announcement.clubName2 && (
                        <div className="flex flex-wrap items-center justify-end gap-1 mt-1 w-full">
                             <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">بالتعاون مع</span>
                             <span className="truncate max-w-full font-bold text-[var(--color-text-primary)]" title={announcement.clubName2}>
                                {announcement.clubName2}
                            </span>
                        </div>
                    )}
                </div>
                <UsersIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            </div>
        )}

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-[var(--color-text-secondary)] border-y border-dashed border-[var(--color-border)] py-4 my-4">
            <div className="col-span-2 flex items-center justify-end gap-3">
                <span className="text-right font-medium">{announcement.location}</span>
                <LocationMarkerIcon className="w-5 h-5 flex-shrink-0" />
            </div>
            <div className="flex items-center justify-end gap-3">
                <span>{formattedDate}</span>
                <CalendarDaysIcon className="w-5 h-5 flex-shrink-0" />
            </div>
            <div className="flex items-center justify-end gap-3">
                <span>{formattedTime}</span>
                <ClockIcon className="w-5 h-5 flex-shrink-0" />
            </div>
        </div>
        
        <div className="my-6 p-3 bg-[var(--color-bg)] rounded-lg">
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
                    className={`group/button relative w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-white font-bold rounded-lg hover:brightness-110 transition-all text-base overflow-hidden ${styles.buttonShadow}`}
                >
                    <span className="transition-transform duration-300 ease-out group-hover/button:-translate-x-3">رابط التسجيل</span>
                     <span className="absolute right-4 transition-all duration-300 ease-out translate-x-10 opacity-0 group-hover/button:translate-x-0 group-hover/button:opacity-100">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </span>
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

import React, { useState } from 'react';
import type { Announcement, UserRole } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import Countdown from './Countdown';
import { ClockIcon } from './icons/ClockIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UsersIcon } from './icons/UsersIcon';

interface AnnouncementCardProps {
  announcement: Announcement;
  userRole: UserRole;
  onDelete: (id: number) => void;
  onEdit: (announcement: Announcement) => void;
  onImageClick: (imageUrl: string) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, userRole, onDelete, onEdit, onImageClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const descriptionLimit = 100;
    const isLongDescription = announcement.details.length > descriptionLimit;

    const eventDate = new Date(announcement.date);
    const formattedDate = eventDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    const getCategoryInfo = (category: 'male' | 'female' | 'all') => {
        switch (category) {
            case 'male': return { text: 'طلاب', color: '#3b82f6' };
            case 'female': return { text: 'طالبات', color: '#f472b6' };
            case 'all': return { text: 'الجميع', color: '#a855f7' };
            default: return { text: 'عام', color: 'var(--color-accent)' };
        }
    };

    const categoryInfo = getCategoryInfo(announcement.category);
    const cardAccentColor = categoryInfo.color;

    const displayedDescription = isLongDescription && !isExpanded
        ? `${announcement.details.substring(0, descriptionLimit)}...`
        : announcement.details;

    return (
    <div 
        className="group relative flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-lg transition-all duration-300 ease-in-out overflow-hidden animate-fade-in-up hover:-translate-y-1 announcement-card-print-container"
        style={{ '--card-accent-color': cardAccentColor } as React.CSSProperties}
    >
      <div
        className="absolute -inset-1 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-30 blur-lg pointer-events-none print-hide"
        style={{ backgroundColor: 'var(--card-accent-color)' }}
        aria-hidden="true"
      ></div>

      <div className="relative z-10 flex flex-col flex-grow">
          <div className="relative cursor-pointer" onClick={() => onImageClick(announcement.imageUrl)}>
            <img
              src={announcement.imageUrl}
              alt={announcement.title}
              className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/1f2937/9ca3af?text=Image+Not+Found')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent print-hide"></div>
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-2">
                        <span 
                            style={{ backgroundColor: cardAccentColor }}
                            className="text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                        >
                            {categoryInfo.text}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--card-accent-color)] to-sky-400">
                        {announcement.title}
                    </h3>
                    {announcement.clubName && (
                        <p className="flex items-center gap-2 mt-1 text-sm font-semibold text-[var(--color-text-secondary)]">
                            <UsersIcon className="w-4 h-4" />
                            <span>{announcement.clubName}</span>
                        </p>
                    )}
                </div>
                {userRole === 'admin' && (
                  <div className="flex-shrink-0 flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300 print-hide" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onEdit(announcement)}
                      className="text-[var(--color-text-secondary)] hover:text-blue-500 transition-all duration-300 p-2 rounded-full hover:bg-blue-500/10"
                      aria-label={`تعديل إعلان ${announcement.title}`}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(announcement.id)}
                      className="text-[var(--color-text-secondary)] hover:text-red-500 transition-all duration-300 p-2 rounded-full hover:bg-red-500/10"
                      aria-label={`حذف إعلان ${announcement.title}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
            </div>
            
            <div className="text-[var(--color-text-secondary)] text-sm mb-4 flex-grow">
                <p className="inline print-hide">
                    {displayedDescription}
                    {isLongDescription && (
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)} 
                            className="text-[var(--color-accent)] font-semibold hover:underline mr-1"
                        >
                            {isExpanded ? 'اقرأ أقل' : 'اقرأ المزيد'}
                        </button>
                    )}
                </p>
                <p className="hidden print-show-block">
                    {announcement.details}
                </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm mb-4 border-t border-b border-[var(--color-border)] py-3">
                <div className="flex items-center gap-2" title="التاريخ">
                    <CalendarIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span className="text-[var(--color-text-primary)]">{formattedDate}</span>
                </div>
                 <div className="flex items-center gap-2" title="الوقت">
                    <ClockIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span className="text-[var(--color-text-primary)]">{formattedTime}</span>
                </div>
                 <div className="flex items-center gap-2 min-w-0" title="المكان">
                    <LocationMarkerIcon className="w-4 h-4 flex-shrink-0 text-[var(--color-text-secondary)]" />
                    <span className="text-[var(--color-text-primary)] truncate">{announcement.location}</span>
                </div>
            </div>

            <div className="mb-5 mt-auto flex flex-col items-center print-hide">
                <h4 className="text-center text-xs font-semibold text-[var(--color-text-secondary)] mb-2">الوقت المتبقي للفعالية</h4>
                <Countdown targetDate={announcement.date} onComplete={() => {}} cardAccentColor={cardAccentColor} />
            </div>

            {announcement.registrationType === 'link' && announcement.registrationUrl ? (
                <a
                href={announcement.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: cardAccentColor, '--tw-ring-color': cardAccentColor } as React.CSSProperties}
                className="block w-full text-center px-6 py-3 text-white font-semibold rounded-md hover:brightness-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] print-hide"
                >
                رابط التسجيل
                </a>
            ) : (
                <div className="flex items-center justify-center gap-2 text-center px-6 py-3 bg-transparent border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-md print-hide">
                    <UsersIcon className="w-5 h-5" />
                    <span>بدون تسجيل (متاح)</span>
                </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default AnnouncementCard;
import React from 'react';
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
    const eventDate = new Date(announcement.date);
    const formattedDate = eventDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    const isFemale = announcement.category === 'female';
    const cardAccentColor = isFemale ? '#f472b6' : 'var(--color-accent)';

    return (
    <div className="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-lg transition-all duration-300 ease-in-out overflow-hidden animate-fade-in-up">
      <div className="relative cursor-pointer" onClick={() => onImageClick(announcement.imageUrl)}>
        <img
          src={announcement.imageUrl}
          alt={announcement.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/1f2937/9ca3af?text=Image+Not+Found')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <h3 className="absolute bottom-4 right-4 text-2xl font-bold text-white">{announcement.title}</h3>
         {userRole === 'admin' && (
          <div className="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onEdit(announcement)}
              className="text-white bg-black/40 hover:bg-blue-500 transition-all duration-300 p-2 rounded-full"
              aria-label={`تعديل إعلان ${announcement.title}`}
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(announcement.id)}
              className="text-white bg-black/40 hover:bg-red-500 transition-all duration-300 p-2 rounded-full"
              aria-label={`حذف إعلان ${announcement.title}`}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-[var(--color-text-secondary)] text-sm mb-4">{announcement.details}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
            <div className="flex items-center gap-2 p-2 bg-[var(--color-bg)] rounded-md">
                <CalendarIcon className="w-5 h-5" style={{ color: cardAccentColor }} />
                <span className="text-[var(--color-text-primary)]">{formattedDate}</span>
            </div>
             <div className="flex items-center gap-2 p-2 bg-[var(--color-bg)] rounded-md">
                <ClockIcon className="w-5 h-5" style={{ color: cardAccentColor }} />
                <span className="text-[var(--color-text-primary)]">{formattedTime}</span>
            </div>
             <div className="flex items-center gap-2 p-2 bg-[var(--color-bg)] rounded-md col-span-1 sm:col-span-2">
                <LocationMarkerIcon className="w-5 h-5" style={{ color: cardAccentColor }} />
                <span className="text-[var(--color-text-primary)]">{announcement.location}</span>
            </div>
        </div>

        <div className="mb-5">
            <h4 className="text-center text-sm font-semibold text-[var(--color-text-secondary)] mb-2">الوقت المتبقي</h4>
            <Countdown targetDate={announcement.date} onComplete={() => {}} cardAccentColor={cardAccentColor} />
        </div>

        {announcement.registrationType === 'link' && announcement.registrationUrl ? (
            <a
            href={announcement.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: cardAccentColor, '--tw-ring-color': cardAccentColor } as React.CSSProperties}
            className="block w-full text-center px-6 py-3 text-white font-semibold rounded-md hover:brightness-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)]"
            >
            رابط التسجيل
            </a>
        ) : (
            <div className="flex items-center justify-center gap-2 text-center px-6 py-3 bg-transparent border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-md">
                <UsersIcon className="w-5 h-5" />
                <span>التسجيل بالحضور المباشر</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;
import React, { useState, useEffect } from 'react';
import type { Announcement } from '../types';
import { XIcon } from './icons/XIcon';

interface AnnouncementFormProps {
  onSave: (data: Omit<Announcement, 'id'>, id: number | null) => void;
  onClose: () => void;
  existingAnnouncement?: Announcement | null;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSave, onClose, existingAnnouncement }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'male' | 'female' | 'all'>('male');
  const [imageUrl, setImageUrl] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);
  const [details, setDetails] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [registrationType, setRegistrationType] = useState<'link' | 'open'>('link');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [clubName, setClubName] = useState('');
  const [error, setError] = useState('');

  const isEditing = !!existingAnnouncement;

  useEffect(() => {
    if (isEditing) {
      setTitle(existingAnnouncement.title);
      setCategory(existingAnnouncement.category);
      setImageUrl(existingAnnouncement.imageUrl);
      setImageDataUrl(existingAnnouncement.imageDataUrl);
      setDetails(existingAnnouncement.details);
      
      const d = new Date(existingAnnouncement.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      
      setEventDate(`${year}-${month}-${day}`);
      setEventTime(`${hours}:${minutes}`);
      
      setLocation(existingAnnouncement.location);
      setRegistrationType(existingAnnouncement.registrationType || 'link');
      setRegistrationUrl(existingAnnouncement.registrationUrl || '');
      setClubName(existingAnnouncement.clubName || '');
    }
  }, [existingAnnouncement, isEditing]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const tempImageUrl = loadEvent.target?.result as string;

            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                
                let width = image.width;
                let height = image.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(image, 0, 0, width, height);
                    const resizedImageDataUrl = canvas.toDataURL(file.type, 0.9);
                    setImageDataUrl(resizedImageDataUrl);
                    setImageUrl(''); // Prioritize uploaded file
                }
            };
            image.src = tempImageUrl;
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || (!imageDataUrl && !imageUrl.trim()) || !eventDate || !eventTime || !location.trim()) {
      setError('الرجاء ملء جميع الحقول المطلوبة (بما في ذلك صورة الإعلان).');
      return;
    }
    
    if (imageUrl.trim()) {
      try { new URL(imageUrl); } catch (_) {
        setError('الرجاء إدخال رابط صورة صالح.'); return;
      }
    }
    
    if (registrationType === 'link') {
        if (!registrationUrl.trim()) {
            setError('رابط التسجيل مطلوب عند اختيار هذا النوع.');
            return;
        }
        try { new URL(registrationUrl); } catch (_) {
            setError('الرجاء إدخال رابط تسجيل صالح.'); return;
        }
    }

    setError('');
    onSave({
        title,
        category,
        imageUrl,
        imageDataUrl,
        details,
        date: new Date(`${eventDate}T${eventTime}`).toISOString(),
        location,
        registrationType,
        registrationUrl: registrationType === 'link' ? registrationUrl : undefined,
        clubName: clubName.trim() || undefined,
    }, isEditing ? existingAnnouncement.id : null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-accent)]">
        {isEditing ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ann-title" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">عنوان الإعلان</label>
              <input id="ann-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
             <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الفئة</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as 'male' | 'female' | 'all')}
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]">
                    <option value="male">طلاب</option>
                    <option value="female">طالبات</option>
                    <option value="all">طلاب وطالبات</option>
                </select>
            </div>
        </div>
        <div>
          <label htmlFor="ann-club-name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">اسم النادي (اختياري)</label>
          <input id="ann-club-name" type="text" placeholder="مثال: نادي البرمجة" value={clubName} onChange={(e) => setClubName(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]" />
        </div>
        <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">صورة الإعلان</label>
            <div className="p-3 bg-[var(--color-bg)] border-2 border-dashed border-[var(--color-border)] rounded-md space-y-3">
                {(imageDataUrl || imageUrl) && (
                    <div className="relative group">
                        <img 
                            src={imageDataUrl || imageUrl} 
                            alt="معاينة الإعلان" 
                            className="w-full max-h-48 object-contain rounded-md bg-black/20"
                        />
                        <button 
                            type="button"
                            onClick={() => { setImageDataUrl(undefined); setImageUrl(''); }}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="إزالة الصورة"
                        >
                            <XIcon className="w-4 h-4"/>
                        </button>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <input 
                        id="ann-image-file"
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageFileChange}
                        className="text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-accent)] file:text-white hover:file:bg-opacity-90 cursor-pointer"
                    />
                    <span className="text-xs text-[var(--color-text-secondary)]">أو</span>
                    <input 
                        id="ann-image-url" 
                        type="url" 
                        placeholder="أدخل رابط صورة" 
                        value={imageUrl} 
                        onChange={(e) => { setImageUrl(e.target.value); setImageDataUrl(undefined); }}
                        className="flex-1 w-full sm:w-auto px-3 py-2 text-sm bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]" 
                    />
                </div>
            </div>
        </div>
        <div>
          <label htmlFor="ann-details" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">التفاصيل</label>
          <textarea id="ann-details" value={details} onChange={(e) => setDetails(e.target.value)} rows={3}
            className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] resize-y"></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ann-date" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">التاريخ</label>
              <input id="ann-date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
             <div>
              <label htmlFor="ann-time" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الوقت</label>
              <input id="ann-time" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
        </div>
         <div>
          <label htmlFor="ann-location" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">المكان</label>
          <input id="ann-location" type="text" value={location} onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]" />
        </div>
        <div>
            <label htmlFor="ann-reg-type" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">نوع التسجيل</label>
            <select id="ann-reg-type" value={registrationType} onChange={(e) => setRegistrationType(e.target.value as 'link' | 'open')}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]">
                <option value="link">يتطلب رابط تسجيل</option>
                <option value="open">متاح بدون تسجيل</option>
            </select>
        </div>
        {registrationType === 'link' && (
            <div className="animate-fade-in-up">
                <label htmlFor="ann-reg-url" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">رابط التسجيل</label>
                <input id="ann-reg-url" type="url" placeholder="https://forms.example.com/register" value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
        )}
        
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-2">
            <button type="button" onClick={onClose}
              className="px-6 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors">
              إلغاء
            </button>
            <button type="submit"
              className="px-6 py-2 bg-[var(--color-accent)] text-white font-semibold rounded-md hover:brightness-90 transition-all">
              {isEditing ? 'تحديث الإعلان' : 'إضافة الإعلان'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;

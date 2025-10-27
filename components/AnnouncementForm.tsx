import React, { useState, useEffect } from 'react';
import type { Announcement } from '../types';

interface AnnouncementFormProps {
  onSave: (data: Omit<Announcement, 'id'>, id: number | null) => void;
  onClose: () => void;
  existingAnnouncement?: Announcement | null;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSave, onClose, existingAnnouncement }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'male' | 'female'>('male');
  const [imageUrl, setImageUrl] = useState('');
  const [details, setDetails] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [error, setError] = useState('');

  const isEditing = !!existingAnnouncement;

  useEffect(() => {
    if (isEditing) {
      setTitle(existingAnnouncement.title);
      setCategory(existingAnnouncement.category);
      setImageUrl(existingAnnouncement.imageUrl);
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
      setRegistrationUrl(existingAnnouncement.registrationUrl);
    }
  }, [existingAnnouncement, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !eventDate || !eventTime || !location.trim() || !registrationUrl.trim()) {
      setError('الرجاء ملء جميع الحقول المطلوبة.');
      return;
    }
    
    try { new URL(imageUrl); } catch (_) {
      setError('الرجاء إدخال رابط صورة صالح.'); return;
    }
    try { new URL(registrationUrl); } catch (_) {
      setError('الرجاء إدخال رابط تسجيل صالح.'); return;
    }

    setError('');
    onSave({
        title,
        category,
        imageUrl,
        details,
        date: new Date(`${eventDate}T${eventTime}`).toISOString(),
        location,
        registrationUrl
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
                <select value={category} onChange={(e) => setCategory(e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]">
                    <option value="male">طلاب</option>
                    <option value="female">طالبات</option>
                </select>
            </div>
        </div>
         <div>
          <label htmlFor="ann-image-url" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">رابط الصورة</label>
          <input id="ann-image-url" type="url" placeholder="https://example.com/image.png" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]" />
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
          <label htmlFor="ann-reg-url" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">رابط التسجيل</label>
          <input id="ann-reg-url" type="url" placeholder="https://forms.example.com/register" value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)]" />
        </div>
        
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
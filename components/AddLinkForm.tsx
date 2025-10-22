import React, { useState, useEffect } from 'react';
import type { LinkItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { availableIcons } from './icons/iconMap';

interface AddLinkFormProps {
  onSave: (id: number | null, title: string, url: string, icon: string) => void;
  onClose: () => void;
  existingLink?: LinkItem | null;
}

const AddLinkForm: React.FC<AddLinkFormProps> = ({ onSave, onClose, existingLink }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>(availableIcons[0].id);
  const [error, setError] = useState('');

  const isEditing = !!existingLink;

  useEffect(() => {
    if (isEditing) {
      setTitle(existingLink.title);
      setUrl(existingLink.url);
      setSelectedIcon(existingLink.icon);
    }
  }, [existingLink, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError('الرجاء ملء كل من عنوان الرابط وعنوان URL.');
      return;
    }
    try {
      new URL(url);
    } catch (_) {
      setError('الرجاء إدخال عنوان URL صالح.');
      return;
    }
    setError('');
    onSave(isEditing ? existingLink.id : null, title, url, selectedIcon);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-accent)]">{isEditing ? 'تعديل الرابط' : 'إضافة رابط جديد'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="link-title" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">عنوان الرابط</label>
          <input
            id="link-title"
            type="text"
            placeholder="مثال: نموذج تسجيل"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
          />
        </div>
        <div>
           <label htmlFor="link-url" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">URL</label>
          <input
            id="link-url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
          />
        </div>
        
        <div>
           <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">اختر أيقونة</label>
           <div className="flex flex-wrap justify-center gap-3">
             {availableIcons.map((icon) => {
               const IconComponent = icon.component;
               const isSelected = selectedIcon === icon.id;
               return (
                 <button
                   key={icon.id}
                   type="button"
                   onClick={() => setSelectedIcon(icon.id)}
                   className={`p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] ${
                     isSelected
                       ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]'
                       : 'bg-[var(--color-bg)] border-[var(--color-border)] hover:border-[var(--color-text-secondary)]'
                   }`}
                   aria-label={`اختر أيقونة ${icon.name}`}
                 >
                   <IconComponent className={`w-6 h-6 ${isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`} />
                 </button>
               );
             })}
           </div>
        </div>
        
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] focus:ring-[var(--color-text-secondary)]"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[var(--color-accent)] text-white font-semibold rounded-md hover:brightness-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] focus:ring-[var(--color-accent)]"
            >
              {!isEditing && <PlusIcon className="w-5 h-5" />}
              <span>{isEditing ? 'تحديث' : 'إضافة'}</span>
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddLinkForm;
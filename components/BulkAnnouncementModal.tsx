
import React, { useState } from 'react';
import Modal from './Modal';
import { DocumentPlusIcon } from './icons/DocumentPlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import type { Announcement } from '../types';

interface BulkAnnouncementModalProps {
  onClose: () => void;
  onSave: (announcements: Omit<Announcement, 'id'>[]) => void;
}

const BulkAnnouncementModal: React.FC<BulkAnnouncementModalProps> = ({ onClose, onSave }) => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleDownloadTemplate = () => {
    const template = [
      {
        "title": "عنوان الإعلان",
        "category": "male (or female, or all)",
        "details": "تفاصيل الإعلان هنا...",
        "date": "2024-12-31T10:00:00",
        "location": "المكان",
        "clubName": "اسم النادي",
        "clubName2": "اسم النادي الثاني (اختياري)",
        "registrationType": "link (or open)",
        "registrationUrl": "https://example.com/register",
        "imageUrl": "https://example.com/image.jpg"
      },
      {
        "title": "إعلان آخر",
        "category": "female",
        "details": "التفاصيل...",
        "date": "2024-12-30T14:00:00",
        "location": "مبنى 5",
        "clubName": "النادي الثقافي",
        "clubName2": "",
        "registrationType": "open",
        "imageUrl": ""
      }
    ];

    const jsonString = JSON.stringify(template, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'announcements_template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setSuccess('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        if (!Array.isArray(data)) {
          throw new Error('الملف يجب أن يحتوي على مصفوفة (Array) من الإعلانات.');
        }

        const validAnnouncements: Omit<Announcement, 'id'>[] = [];
        const requiredFields = ['title', 'category', 'details', 'date', 'location'];

        data.forEach((item: any, index) => {
          // Basic validation
          for (const field of requiredFields) {
            if (!item[field]) {
              throw new Error(`العنصر رقم ${index + 1} يفتقد الحقل المطلوب: ${field}`);
            }
          }

          // Validate category
          if (!['male', 'female', 'all'].includes(item.category)) {
             throw new Error(`العنصر رقم ${index + 1} يحتوي على فئة غير صالحة. استخدم: male, female, أو all`);
          }

          validAnnouncements.push({
            title: item.title,
            category: item.category,
            details: item.details,
            date: new Date(item.date).toISOString(), // Ensure ISO format
            location: item.location,
            clubName: item.clubName || undefined,
            clubName2: item.clubName2 || undefined,
            registrationType: item.registrationType === 'open' ? 'open' : 'link',
            registrationUrl: item.registrationUrl || undefined,
            imageUrl: item.imageUrl || '', // Fallback for image
            imageDataUrl: undefined // Bulk upload doesn't support Base64 easily usually
          });
        });

        onSave(validAnnouncements);
        setSuccess(`تمت قراءة ${validAnnouncements.length} إعلان بنجاح!`);
        
        // Close automatically after a brief success message
        setTimeout(() => {
            onClose();
        }, 1500);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'حدث خطأ أثناء قراءة الملف. تأكد من تنسيق JSON.');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <Modal onClose={onClose} size="lg">
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-[var(--color-bg)] p-3 rounded-full mb-4">
          <DocumentPlusIcon className="w-8 h-8 text-[var(--color-accent)]" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-[var(--color-accent)]">إضافة إعلانات متعددة</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          يمكنك إضافة عدة إعلانات دفعة واحدة باستخدام ملف JSON.
        </p>

        <div className="space-y-6">
          <div className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] text-right text-sm">
            <h3 className="font-bold mb-2">تعليمات:</h3>
            <ol className="list-decimal list-inside space-y-1 text-[var(--color-text-secondary)]">
              <li>قم بتحميل ملف القالب (Template).</li>
              <li>افتح الملف باستخدام أي محرر نصوص.</li>
              <li>أضف بيانات الإعلانات مع مراعاة صيغة التاريخ (YYYY-MM-DDTHH:mm:ss).</li>
              <li>احفظ الملف وقم برفعه هنا.</li>
            </ol>
            <div className="mt-4 text-center">
                <button 
                    onClick={handleDownloadTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
                >
                    <DownloadIcon className="w-4 h-4" />
                    <span>تحميل القالب</span>
                </button>
            </div>
          </div>

          <div className="relative">
            <label 
                htmlFor="bulk-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-[var(--color-border)] border-dashed rounded-lg cursor-pointer bg-[var(--color-card-bg)] hover:bg-[var(--color-bg)] transition-colors"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <DocumentPlusIcon className="w-8 h-8 mb-3 text-[var(--color-text-secondary)]" />
                    <p className="mb-2 text-sm text-[var(--color-text-secondary)]"><span className="font-semibold">اضغط للرفع</span> أو اسحب الملف هنا</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">JSON file only</p>
                </div>
                <input id="bulk-upload" type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
            </label>
          </div>
          
          {error && (
              <div className="p-3 bg-red-500/10 text-red-400 rounded-md text-sm border border-red-500/20">
                  {error}
              </div>
          )}
           {success && (
              <div className="p-3 bg-green-500/10 text-green-400 rounded-md text-sm border border-green-500/20">
                  {success}
              </div>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkAnnouncementModal;

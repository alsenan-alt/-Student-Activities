
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

  const handleDownloadJSONTemplate = () => {
    const template = [
      {
        "title": "عنوان الإعلان",
        "category": "male",
        "details": "تفاصيل الإعلان هنا...",
        "date": "2024-12-31T10:00:00",
        "location": "المكان",
        "clubName": "اسم النادي",
        "registrationType": "link",
        "registrationUrl": "https://example.com/register",
        "imageUrl": "https://example.com/image.jpg"
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

  const handleDownloadCSVTemplate = () => {
    const headers = ['title', 'category', 'details', 'date', 'location', 'clubName', 'registrationType', 'registrationUrl', 'imageUrl'];
    // Adding BOM \uFEFF for Arabic support in Excel
    const sampleRow1 = ['عنوان الإعلان', 'male', 'تفاصيل الإعلان هنا', '2025-10-20 10:00', 'المكان', 'اسم النادي', 'link', 'https://example.com', ''];
    const sampleRow2 = ['إعلان آخر', 'female', 'التفاصيل...', '2025-11-15 14:00', 'مبنى 5', 'النادي الثقافي', 'open', '', ''];

    const csvContent = [
        headers.join(','),
        sampleRow1.map(f => `"${f}"`).join(','),
        sampleRow2.map(f => `"${f}"`).join(',')
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'announcements_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parseCSV = (content: string): any[] => {
      const lines = content.split(/\r\n|\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) return []; // Header + 1 row

      // Parse headers, removing quotes
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      
      const result = [];
      for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          const row: string[] = [];
          let current = '';
          let inQuotes = false;
          
          // Simple CSV state machine parser
          for (let j = 0; j < line.length; j++) {
              const char = line[j];
              if (char === '"') {
                  if (inQuotes && line[j + 1] === '"') {
                      current += '"'; // Handle escaped double quotes
                      j++;
                  } else {
                      inQuotes = !inQuotes;
                  }
              } else if (char === ',' && !inQuotes) {
                  row.push(current);
                  current = '';
              } else {
                  current += char;
              }
          }
          row.push(current); // Push the last cell

          const obj: any = {};
          headers.forEach((header, index) => {
              if (index < row.length) {
                 // Clean up extra quotes if present
                 let val = row[index].trim();
                 // Note: The manual parsing above collects content inside quotes, so usually we don't need to strip quotes again
                 // unless the file format is slightly different. The loop above extracts the *value* so it's clean.
                 obj[header] = val; 
              }
          });
          result.push(obj);
      }
      return result;
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
        let data: any[] = [];

        if (file.name.toLowerCase().endsWith('.csv')) {
            data = parseCSV(content);
        } else {
            // Fallback for JSON
            data = JSON.parse(content);
        }

        if (!Array.isArray(data)) {
          throw new Error('الملف يجب أن يحتوي على قائمة من الإعلانات.');
        }

        const validAnnouncements: Omit<Announcement, 'id'>[] = [];
        const requiredFields = ['title', 'category', 'details', 'date', 'location'];

        data.forEach((item: any, index) => {
          // Normalize keys (trim spaces)
          const normalizedItem: any = {};
          Object.keys(item).forEach(key => {
              normalizedItem[key.trim()] = item[key];
          });

          // Check required fields
          for (const field of requiredFields) {
            if (!normalizedItem[field]) {
              throw new Error(`العنصر رقم ${index + 1} يفتقد الحقل المطلوب: ${field}`);
            }
          }
          
          // Normalize Category
          let category = normalizedItem.category?.toLowerCase().trim();
          if (category === 'طلاب' || category === 'ذكور') category = 'male';
          if (category === 'طالبات' || category === 'إناث') category = 'female';
          if (category === 'طلاب وطالبات' || category === 'عام' || category === 'الكل') category = 'all';

          if (!['male', 'female', 'all'].includes(category)) {
             throw new Error(`العنصر رقم ${index + 1} يحتوي على فئة غير صالحة (${normalizedItem.category}). استخدم: male, female, all أو طلاب, طالبات`);
          }
          
          // Date Validation
          // Try to handle standard formats or ISO
          let dateVal = new Date(normalizedItem.date);
          if (isNaN(dateVal.getTime())) {
               throw new Error(`العنصر رقم ${index + 1} يحتوي على تاريخ غير صالح (${normalizedItem.date}). يفضل استخدام الصيغة YYYY-MM-DD HH:mm`);
          }

          validAnnouncements.push({
            title: normalizedItem.title,
            category: category,
            details: normalizedItem.details,
            date: dateVal.toISOString(),
            location: normalizedItem.location,
            clubName: normalizedItem.clubName || undefined,
            registrationType: normalizedItem.registrationType === 'open' ? 'open' : 'link',
            registrationUrl: normalizedItem.registrationUrl || undefined,
            imageUrl: normalizedItem.imageUrl || '',
          });
        });

        onSave(validAnnouncements);
        setSuccess(`تمت إضافة ${validAnnouncements.length} إعلان بنجاح!`);
        
        setTimeout(() => {
            onClose();
        }, 1500);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'حدث خطأ أثناء قراءة الملف. تأكد من صحة التنسيق.');
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
          يمكنك إضافة عدة إعلانات دفعة واحدة باستخدام ملف Excel (CSV) أو JSON.
        </p>

        <div className="space-y-6">
          <div className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] text-right text-sm">
            <h3 className="font-bold mb-2 text-[var(--color-text-primary)]">خطوات الاستخدام:</h3>
            <ol className="list-decimal list-inside space-y-2 text-[var(--color-text-secondary)]">
              <li>قم بتحميل ملف القالب (نوصي باستخدام CSV لسهولة التعامل مع Excel).</li>
              <li>افتح الملف، عبئ البيانات، واحفظه بنفس الصيغة.</li>
              <li>تأكد من تنسيق التاريخ (يفضل: <span dir="ltr">2025-12-31 14:00</span>).</li>
              <li>ارفع الملف المعبأ هنا.</li>
            </ol>
            <div className="mt-4 flex justify-center gap-3">
                <button 
                    onClick={handleDownloadCSVTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/10 border border-green-600/30 text-green-600 rounded-md hover:bg-green-600/20 transition-colors"
                    title="أفضل لبرنامج Excel"
                >
                    <DownloadIcon className="w-4 h-4" />
                    <span>قالب Excel (CSV)</span>
                </button>
                <button 
                    onClick={handleDownloadJSONTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-md hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                    <DownloadIcon className="w-4 h-4" />
                    <span>قالب JSON</span>
                </button>
            </div>
          </div>

          <div className="relative">
            <label 
                htmlFor="bulk-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-[var(--color-border)] border-dashed rounded-lg cursor-pointer bg-[var(--color-card-bg)] hover:bg-[var(--color-bg)] transition-colors group"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <DocumentPlusIcon className="w-8 h-8 mb-3 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors" />
                    <p className="mb-2 text-sm text-[var(--color-text-secondary)]"><span className="font-semibold text-[var(--color-accent)]">اضغط للرفع</span> أو اسحب الملف هنا</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">يدعم ملفات .csv و .json</p>
                </div>
                <input id="bulk-upload" type="file" className="hidden" accept=".csv,.json" onChange={handleFileUpload} />
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

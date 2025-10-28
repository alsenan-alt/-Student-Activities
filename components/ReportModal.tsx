import React, { useMemo, useState } from 'react';
import type { Announcement } from '../types';
import Modal from './Modal';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ReportModalProps {
  announcements: Announcement[];
  onClose: () => void;
}

type ClubData = {
  title: string;
  category: 'male' | 'female' | 'all';
};

const getCategoryText = (category: 'male' | 'female' | 'all') => {
    switch (category) {
        case 'male': return 'طلاب';
        case 'female': return 'طالبات';
        case 'all': return 'الجميع';
        default: return 'غير محدد';
    }
};

const ReportModal: React.FC<ReportModalProps> = ({ announcements, onClose }) => {
    const [isCopied, setIsCopied] = useState(false);

    const reportText = useMemo(() => {
        const byClub = announcements.reduce((acc, ann) => {
            const club = ann.clubName?.trim() || 'بدون نادي';
            if (!acc[club]) {
                acc[club] = [];
            }
            acc[club].push({ title: ann.title, category: ann.category });
            return acc;
        }, {} as Record<string, ClubData[]>);

        let report = `تقرير الأنشطة الطلابية\n`;
        report += `====================\n\n`;

        if (Object.keys(byClub).length === 0) {
            report += "لا توجد إعلانات لإنشاء تقرير.";
            return report;
        }

        const sortedClubs = Object.keys(byClub).sort();

        for (const clubName of sortedClubs) {
            const clubAnnouncements = byClub[clubName];
            report += `** ${clubName} **\n`;
            report += `إجمالي الإعلانات: ${clubAnnouncements.length}\n\n`;
            
            clubAnnouncements.forEach(ann => {
                report += `- ${ann.title} (الفئة: ${getCategoryText(ann.category)})\n`;
            });

            report += `\n--------------------\n\n`;
        }

        return report;
    }, [announcements]);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(reportText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <Modal onClose={onClose}>
            <div className="text-center mb-6">
                 <div className="inline-flex items-center justify-center bg-[var(--color-bg)] p-3 rounded-full mb-4">
                    <DocumentTextIcon className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-accent)]">تقرير الأنشطة</h2>
                <p className="text-[var(--color-text-secondary)]">تقرير نصي جاهز للنسخ والمشاركة.</p>
            </div>

            <div 
                className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] max-h-60 overflow-y-auto text-right text-[var(--color-text-primary)]"
            >
                <pre className="whitespace-pre-wrap text-sm font-sans">{reportText}</pre>
            </div>

            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors"
                >
                    إغلاق
                </button>
                <button
                    onClick={handleCopy}
                    disabled={isCopied}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-2 font-semibold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] w-40 ${
                        isCopied 
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-[var(--color-accent)] text-white hover:brightness-90 focus:ring-[var(--color-accent)]'
                    }`}
                >
                    {isCopied ? (
                        <>
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>تم النسخ!</span>
                        </>
                    ) : (
                        <>
                            <ClipboardIcon className="w-5 h-5" />
                            <span>نسخ التقرير</span>
                        </>
                    )}
                </button>
            </div>
        </Modal>
    );
};

export default ReportModal;

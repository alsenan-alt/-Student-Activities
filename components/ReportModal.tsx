import React, { useMemo, useState, useRef } from 'react';
import type { Announcement } from '../types';
import Modal from './Modal';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { PrinterIcon } from './icons/PrinterIcon';

interface ReportModalProps {
  announcements: Announcement[];
  onClose: () => void;
}

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
    const reportContentRef = useRef<HTMLDivElement>(null);

    const organizedAnnouncements = useMemo(() => {
        const byClub = announcements.reduce((acc, ann) => {
            const club = ann.clubName?.trim() || 'بدون نادي';
            if (!acc[club]) {
                acc[club] = [];
            }
            acc[club].push(ann);
            return acc;
        }, {} as Record<string, Announcement[]>);
        
        return Object.entries(byClub).sort((a, b) => a[0].localeCompare(b[0]));
    }, [announcements]);

    const reportTextForCopy = useMemo(() => {
        let report = `تقرير الأنشطة الطلابية\n`;
        report += `====================\n\n`;

        if (organizedAnnouncements.length === 0) {
            return report + "لا توجد إعلانات لإنشاء تقرير.";
        }

        organizedAnnouncements.forEach(([clubName, clubAnnouncements]) => {
            report += `** ${clubName} **\n`;
            report += `إجمالي الإعلانات: ${clubAnnouncements.length}\n\n`;
            clubAnnouncements.forEach(ann => {
                const eventDate = new Date(ann.date);
                const formattedDate = eventDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                report += `- ${ann.title} (الفئة: ${getCategoryText(ann.category)}, التاريخ: ${formattedDate})\n`;
            });
            report += `\n--------------------\n\n`;
        });

        return report;
    }, [organizedAnnouncements]);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(reportTextForCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const handlePrint = () => {
        const content = reportContentRef.current;
        if (!content) return;
        content.classList.add('printable-area');
        document.body.classList.add('is-printing');
        window.print();
        document.body.classList.remove('is-printing');
        content.classList.remove('printable-area');
    };

    return (
        <Modal onClose={onClose}>
            <div className="text-center mb-6 print-hide">
                 <div className="inline-flex items-center justify-center bg-[var(--color-bg)] p-3 rounded-full mb-4">
                    <DocumentTextIcon className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-accent)]">تقرير الأنشطة</h2>
                <p className="text-[var(--color-text-secondary)]">تقرير مُنسّق جاهز للطباعة والمشاركة.</p>
            </div>

            <div 
                ref={reportContentRef}
                className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] max-h-80 overflow-y-auto text-right text-[var(--color-text-primary)]"
            >
                <div className="no-print-border">
                    <h1 className="text-xl font-bold mb-1">تقرير الأنشطة الطلابية</h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">تاريخ الإنشاء: {new Date().toLocaleDateString('ar-EG')}</p>
                    <hr className="border-[var(--color-border)] mb-4" />
                </div>

                {organizedAnnouncements.length === 0 && (
                    <p className="text-center text-[var(--color-text-secondary)] py-8">لا توجد بيانات لإنشاء تقرير.</p>
                )}
                
                {organizedAnnouncements.map(([clubName, clubAnnouncements]) => (
                    <div key={clubName} className="mb-6">
                        <h2 className="text-lg font-bold text-[var(--color-accent)] mb-2">{clubName} ({clubAnnouncements.length} إعلانات)</h2>
                        <div className="overflow-x-auto">
                             <table className="w-full text-sm">
                                <thead className="bg-[var(--color-card-bg)]">
                                    <tr>
                                        <th className="p-2 font-semibold">النشاط</th>
                                        <th className="p-2 font-semibold">التاريخ</th>
                                        <th className="p-2 font-semibold">المكان</th>
                                        <th className="p-2 font-semibold">الفئة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clubAnnouncements.map(ann => {
                                         const eventDate = new Date(ann.date);
                                         const formattedDate = eventDate.toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                         return (
                                            <tr key={ann.id} className="border-b border-[var(--color-border)]">
                                                <td className="p-2">{ann.title}</td>
                                                <td className="p-2 whitespace-nowrap">{formattedDate}</td>
                                                <td className="p-2">{ann.location}</td>
                                                <td className="p-2">{getCategoryText(ann.category)}</td>
                                            </tr>
                                         );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-6 print-hide">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors"
                >
                    إغلاق
                </button>
                <div className="flex gap-2">
                     <button
                        onClick={handleCopy}
                        disabled={isCopied}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] w-36 ${
                            isCopied 
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500'
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
                                <span>نسخ كنص</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-md transition-all bg-[var(--color-accent)] text-white hover:brightness-90"
                    >
                        <PrinterIcon className="w-5 h-5" />
                        <span>طباعة</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ReportModal;
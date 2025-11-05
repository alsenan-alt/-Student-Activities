import React, { useMemo, useRef } from 'react';
import type { Announcement } from '../types';
import Modal from './Modal';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { PrinterIcon } from './icons/PrinterIcon';

interface StatisticsModalProps {
  announcements: Announcement[];
  onClose: () => void;
}

type ClubStats = {
    total: number;
    male: { count: number; titles: string[] };
    female: { count: number; titles: string[] };
    all: { count: number; titles: string[] };
};

const getCategoryInfo = (category: 'male' | 'female' | 'all') => {
    switch (category) {
        case 'male': return { text: 'طلاب', color: '#3b82f6' };
        case 'female': return { text: 'طالبات', color: '#f472b6' };
        case 'all': return { text: 'الجميع', color: '#a855f7' };
        default: return { text: 'عام', color: 'var(--color-accent)' };
    }
};

const StatisticsModal: React.FC<StatisticsModalProps> = ({ announcements, onClose }) => {
    const statsContentRef = useRef<HTMLDivElement>(null);

    const stats = useMemo(() => {
        const total = announcements.length;

        const byCategory = {
            male: announcements.filter(a => a.category === 'male').length,
            female: announcements.filter(a => a.category === 'female').length,
            all: announcements.filter(a => a.category === 'all').length,
        };

        const byClub = announcements.reduce((acc, ann) => {
            const club = ann.clubName?.trim() || 'بدون نادي';
            if (!acc[club]) {
                acc[club] = {
                    total: 0,
                    male: { count: 0, titles: [] },
                    female: { count: 0, titles: [] },
                    all: { count: 0, titles: [] },
                };
            }

            acc[club].total++;
            if (ann.category === 'male') {
                acc[club].male.count++;
                acc[club].male.titles.push(ann.title);
            } else if (ann.category === 'female') {
                acc[club].female.count++;
                acc[club].female.titles.push(ann.title);
            } else if (ann.category === 'all') {
                acc[club].all.count++;
                acc[club].all.titles.push(ann.title);
            }
            
            return acc;
        }, {} as Record<string, ClubStats>);

        const sortedClubs = Object.entries(byClub).sort((a: [string, ClubStats], b: [string, ClubStats]) => b[1].total - a[1].total);

        return { total, byCategory, sortedClubs };
    }, [announcements]);

    const handlePrint = () => {
        const content = statsContentRef.current;
        if (!content) return;

        const allDetails = content.querySelectorAll('details');

        // This function will be called right before the print dialog opens.
        const handleBeforePrint = () => {
            allDetails.forEach(details => (details.open = true));
            content.classList.add('printable-area');
            document.body.classList.add('is-printing');
        };

        // This function will be called after the print dialog is closed.
        const handleAfterPrint = () => {
            document.body.classList.remove('is-printing');
            content.classList.remove('printable-area');
            allDetails.forEach(details => (details.open = false));
            
            // Clean up the event listeners
            window.removeEventListener('beforeprint', handleBeforePrint);
            window.removeEventListener('afterprint', handleAfterPrint);
        };

        window.addEventListener('beforeprint', handleBeforePrint);
        window.addEventListener('afterprint', handleAfterPrint);

        window.print();
    };

    return (
        <Modal onClose={onClose}>
            <div ref={statsContentRef}>
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center bg-[var(--color-bg)] p-3 rounded-full mb-4 print-hide">
                        <ChartBarIcon className="w-8 h-8 text-[var(--color-accent)]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--color-accent)]">إحصائيات الإعلانات</h2>
                    <p className="text-[var(--color-text-secondary)]">نظرة عامة مفصلة على جميع الأنشطة المعلنة.</p>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)]">
                            <h3 className="font-semibold text-sm text-[var(--color-text-secondary)]">إجمالي الإعلانات</h3>
                            <span className="text-3xl font-bold font-mono text-[var(--color-text-primary)]">{stats.total}</span>
                        </div>
                         <div className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)]">
                            <h3 className="font-semibold text-sm text-[var(--color-text-secondary)]">إعلانات الطلاب</h3>
                            <span className="text-3xl font-bold font-mono" style={{color: getCategoryInfo('male').color}}>{stats.byCategory.male}</span>
                        </div>
                         <div className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)]">
                            <h3 className="font-semibold text-sm text-[var(--color-text-secondary)]">إعلانات الطالبات</h3>
                            <span className="text-3xl font-bold font-mono" style={{color: getCategoryInfo('female').color}}>{stats.byCategory.female}</span>
                        </div>
                    </div>
                    
                    {stats.sortedClubs.map(([clubName, clubData]) => (
                        <details key={clubName} className="bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] group overflow-hidden">
                            <summary className="font-bold text-lg text-[var(--color-accent)] cursor-pointer flex justify-between items-center p-4 list-none">
                                <div className="flex items-center gap-3">
                                    <ChevronRightIcon className="w-5 h-5 text-[var(--color-text-secondary)] transition-transform duration-200 group-open:rotate-90 print-hide" />
                                    <span>{clubName}</span>
                                </div>
                                <span className="font-mono bg-[var(--color-card-bg)] px-3 py-1 rounded-full text-sm">{clubData.total}</span>
                            </summary>
                            <div className="px-4 pb-4 space-y-3 border-t border-[var(--color-border)]">
                                <div className="pt-3">
                                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">توزيع الأنشطة</h4>
                                    <div className="w-full flex rounded-full overflow-hidden bg-[var(--color-card-bg)] h-6 text-xs text-white font-bold">
                                        {clubData.male.count > 0 && <div style={{width: `${(clubData.male.count / clubData.total) * 100}%`, backgroundColor: getCategoryInfo('male').color}} className="flex items-center justify-center">{clubData.male.count}</div>}
                                        {clubData.female.count > 0 && <div style={{width: `${(clubData.female.count / clubData.total) * 100}%`, backgroundColor: getCategoryInfo('female').color}} className="flex items-center justify-center">{clubData.female.count}</div>}
                                        {clubData.all.count > 0 && <div style={{width: `${(clubData.all.count / clubData.total) * 100}%`, backgroundColor: getCategoryInfo('all').color}} className="flex items-center justify-center">{clubData.all.count}</div>}
                                    </div>
                                    <div className="flex justify-center gap-4 mt-2 text-xs">
                                        {clubData.male.count > 0 && <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: getCategoryInfo('male').color}}></span>طلاب</div>}
                                        {clubData.female.count > 0 && <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: getCategoryInfo('female').color}}></span>طالبات</div>}
                                        {clubData.all.count > 0 && <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: getCategoryInfo('all').color}}></span>الجميع</div>}
                                    </div>
                                </div>
                                <div className="pt-3">
                                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">قائمة الأنشطة</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-[var(--color-text-secondary)] pr-4">
                                        {clubData.male.titles.map((title, index) => <li key={`m-${index}`}>{title}</li>)}
                                        {clubData.female.titles.map((title, index) => <li key={`f-${index}`}>{title}</li>)}
                                        {clubData.all.titles.map((title, index) => <li key={`a-${index}`}>{title}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </details>
                    ))}
                    
                    {announcements.length === 0 && (
                        <p className="text-[var(--color-text-secondary)] text-center py-6">لا توجد إعلانات لعرض إحصائياتها.</p>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mt-6 print-hide">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors"
                >
                    إغلاق
                </button>
                 <button
                    onClick={handlePrint}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 font-semibold rounded-md transition-all bg-[var(--color-accent)] text-white hover:brightness-90"
                >
                    <PrinterIcon className="w-5 h-5" />
                    <span>طباعة</span>
                </button>
            </div>
        </Modal>
    );
};

export default StatisticsModal;
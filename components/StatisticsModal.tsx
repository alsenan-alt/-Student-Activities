import React, { useMemo } from 'react';
import type { Announcement } from '../types';
import Modal from './Modal';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

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

const StatisticsModal: React.FC<StatisticsModalProps> = ({ announcements, onClose }) => {
    const stats = useMemo(() => {
        const total = announcements.length;

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

        // FIX: Add explicit types to sort callback parameters to fix type inference issue.
        const sortedClubs = Object.entries(byClub).sort((a: [string, ClubStats], b: [string, ClubStats]) => b[1].total - a[1].total);

        return { total, sortedClubs };
    }, [announcements]);

    return (
        <Modal onClose={onClose}>
            <div className="text-center mb-6">
                 <div className="inline-flex items-center justify-center bg-[var(--color-bg)] p-3 rounded-full mb-4">
                    <ChartBarIcon className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-accent)]">إحصائيات الإعلانات</h2>
                <p className="text-[var(--color-text-secondary)]">نظرة عامة مفصلة على جميع الأنشطة المعلنة.</p>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                 <div className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] flex justify-between items-center">
                    <h3 className="font-bold text-lg text-[var(--color-accent)]">إجمالي الإعلانات</h3>
                    <span className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">{stats.total}</span>
                </div>
                
                {stats.sortedClubs.map(([clubName, clubData]) => (
                    <details key={clubName} className="bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] group overflow-hidden">
                        <summary className="font-bold text-lg text-[var(--color-accent)] cursor-pointer flex justify-between items-center p-4 list-none">
                            <div className="flex items-center gap-3">
                                <ChevronRightIcon className="w-5 h-5 text-[var(--color-text-secondary)] transition-transform duration-200 group-open:rotate-90" />
                                <span>{clubName}</span>
                            </div>
                            <span className="font-mono bg-[var(--color-card-bg)] px-3 py-1 rounded-full text-sm">{clubData.total}</span>
                        </summary>
                        <div className="px-4 pb-4 space-y-3 border-t border-[var(--color-border)]">
                            {clubData.male.count > 0 && (
                                <div className="pt-3">
                                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">طلاب ({clubData.male.count})</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-[var(--color-text-secondary)] pr-4">
                                        {clubData.male.titles.map((title, index) => <li key={index}>{title}</li>)}
                                    </ul>
                                </div>
                            )}
                            {clubData.female.count > 0 && (
                                <div className="pt-3">
                                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">طالبات ({clubData.female.count})</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-[var(--color-text-secondary)] pr-4">
                                        {clubData.female.titles.map((title, index) => <li key={index}>{title}</li>)}
                                    </ul>
                                </div>
                            )}
                            {clubData.all.count > 0 && (
                                <div className="pt-3">
                                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">الجميع ({clubData.all.count})</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-[var(--color-text-secondary)] pr-4">
                                        {clubData.all.titles.map((title, index) => <li key={index}>{title}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </details>
                ))}
                
                {announcements.length === 0 && (
                    <p className="text-[var(--color-text-secondary)] text-center py-6">لا توجد إعلانات لعرض إحصائياتها.</p>
                )}
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors"
                >
                    إغلاق
                </button>
            </div>
        </Modal>
    );
};

export default StatisticsModal;
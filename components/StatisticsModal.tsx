import React, { useMemo, useRef } from 'react';
import type { Announcement } from '../types';
import Modal from './Modal';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { PrinterIcon } from './icons/PrinterIcon';

interface StatisticsModalProps {
  announcements: Announcement[];
  onClose: () => void;
}

const getCategoryInfo = (category: 'male' | 'female' | 'all') => {
    switch (category) {
        case 'male': return { text: 'طلاب', color: '#3b82f6' };
        case 'female': return { text: 'طالبات', color: '#f472b6' };
        case 'all': return { text: 'الجميع', color: '#a855f7' };
        default: return { text: 'عام', color: 'var(--color-accent)' };
    }
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode, color?: string }> = ({ title, value, icon, color }) => (
    <div className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] flex items-center gap-4 stats-card">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full" style={{ backgroundColor: color ? `${color}20` : 'var(--color-accent-20)', color: color || 'var(--color-accent)'}}>
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-sm text-[var(--color-text-secondary)]">{title}</h3>
            <span className="text-3xl font-bold font-mono" style={{color: color || 'var(--color-text-primary)'}}>{value}</span>
        </div>
    </div>
);

const CategoryDonutChart: React.FC<{ data: { male: number; female: number; all: number; total: number } }> = ({ data }) => {
    if (data.total === 0) return <div className="flex items-center justify-center h-full text-[var(--color-text-secondary)]">لا توجد بيانات للرسم البياني</div>;

    const maleInfo = getCategoryInfo('male');
    const femaleInfo = getCategoryInfo('female');
    const allInfo = getCategoryInfo('all');

    const malePercentage = (data.male / data.total) * 100;
    const femalePercentage = (data.female / data.total) * 100;
    
    const circumference = 2 * Math.PI * 45;
    const maleStroke = (malePercentage / 100) * circumference;
    const femaleStroke = (femalePercentage / 100) * circumference;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative w-48 h-48">
                 <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="var(--color-border)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke={maleInfo.color} strokeWidth="10" strokeDasharray={`${maleStroke} ${circumference}`} />
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke={femaleInfo.color} strokeWidth="10" strokeDasharray={`${femaleStroke} ${circumference}`} strokeDashoffset={-maleStroke} />
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke={allInfo.color} strokeWidth="10" strokeDasharray={`${circumference - maleStroke - femaleStroke} ${circumference}`} strokeDashoffset={-(maleStroke + femaleStroke)} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-mono">{data.total}</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">إجمالي</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded" style={{backgroundColor: maleInfo.color}}></span>{maleInfo.text}: {data.male} ({~~malePercentage}%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded" style={{backgroundColor: femaleInfo.color}}></span>{femaleInfo.text}: {data.female} ({~~femalePercentage}%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded" style={{backgroundColor: allInfo.color}}></span>{allInfo.text}: {data.all} ({100 - ~~malePercentage - ~~femalePercentage}%)</div>
            </div>
        </div>
    );
};


const TopClubsBarChart: React.FC<{ clubs: [string, { total: number }][] }> = ({ clubs }) => {
    const top5 = clubs.slice(0, 5);
    const max = top5.length > 0 ? top5[0][1].total : 0;
    
    if (max === 0) return <div className="flex items-center justify-center h-full text-[var(--color-text-secondary)]">لا توجد بيانات لعرضها</div>;

    return (
        <div className="space-y-3">
            {/* FIX: Destructuring inside the map body to potentially help with type inference issues. */}
            {top5.map((clubEntry) => {
                const [name, data] = clubEntry;
                return (
                    <div key={name} className="flex items-center gap-3 text-sm">
                        <span className="w-32 truncate text-right text-[var(--color-text-secondary)]" title={name}>{name}</span>
                        <div className="flex-1 bg-[var(--color-bg)] rounded-full h-5">
                            <div 
                                className="bg-[var(--color-accent)] h-5 rounded-full flex items-center justify-end px-2 text-white font-bold" 
                                style={{width: `${(data.total / max) * 100}%`}}
                            >
                               {data.total}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
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
                acc[club] = { total: 0, male: 0, female: 0, all: 0 };
            }
            acc[club].total++;
            acc[club][ann.category]++;
            return acc;
        }, {} as Record<string, { total: number; male: number; female: number; all: number; }>);

        // FIX: Explicitly cast the value from Object.entries to resolve type inference issue.
        const sortedClubs = Object.entries(byClub).sort((a, b) => (b[1] as { total: number }).total - (a[1] as { total: number }).total);

        return { total, byCategory, sortedClubs };
    }, [announcements]);

    const handlePrint = () => {
        const content = statsContentRef.current;
        if (!content) return;

        const handleBeforePrint = () => {
            content.classList.add('printable-area');
            document.body.classList.add('is-printing');
        };
        const handleAfterPrint = () => {
            document.body.classList.remove('is-printing');
            content.classList.remove('printable-area');
            window.removeEventListener('beforeprint', handleBeforePrint);
            window.removeEventListener('afterprint', handleAfterPrint);
        };

        window.addEventListener('beforeprint', handleBeforePrint);
        window.addEventListener('afterprint', handleAfterPrint);
        window.print();
    };

    return (
        <Modal onClose={onClose} size="5xl">
            <div ref={statsContentRef}>
                <div className="text-center mb-6 print-hide">
                    <h2 className="text-3xl font-bold text-[var(--color-accent)]">لوحة الإحصائيات</h2>
                    <p className="text-[var(--color-text-secondary)]">نظرة عامة مرئية على جميع الأنشطة المعلنة.</p>
                </div>

                <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 pb-4">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <StatCard title="إجمالي الإعلانات" value={stats.total} icon={<ChartBarIcon className="w-6 h-6"/>} />
                       <StatCard title="أنشطة الطلاب" value={stats.byCategory.male} icon={<div className="font-bold text-lg">♂</div>} color={getCategoryInfo('male').color} />
                       <StatCard title="أنشطة الطالبات" value={stats.byCategory.female} icon={<div className="font-bold text-lg">♀</div>} color={getCategoryInfo('female').color} />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stats-dashboard-grid">
                        <div className="bg-[var(--color-card-bg)] p-4 rounded-lg border border-[var(--color-border)] stats-chart-container">
                            <h3 className="font-bold mb-4 text-center text-[var(--color-text-primary)]">توزيع الأنشطة حسب الفئة</h3>
                            <CategoryDonutChart data={{...stats.byCategory, total: stats.total}} />
                        </div>
                        <div className="bg-[var(--color-card-bg)] p-4 rounded-lg border border-[var(--color-border)] stats-chart-container">
                            <h3 className="font-bold mb-4 text-center text-[var(--color-text-primary)]">أكثر 5 أندية نشاطًا</h3>
                            <TopClubsBarChart clubs={stats.sortedClubs} />
                        </div>
                    </div>
                    
                    {/* Detailed Table */}
                    <div className="bg-[var(--color-card-bg)] p-4 rounded-lg border border-[var(--color-border)] stats-details-table">
                         <h3 className="font-bold mb-4 text-center text-[var(--color-text-primary)]">التفاصيل حسب النادي</h3>
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-center">
                                <thead className="border-b border-[var(--color-border)]">
                                    <tr>
                                        <th className="p-2 text-right font-semibold">النادي</th>
                                        <th className="p-2 font-semibold">طلاب</th>
                                        <th className="p-2 font-semibold">طالبات</th>
                                        <th className="p-2 font-semibold">الجميع</th>
                                        <th className="p-2 font-semibold">الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.sortedClubs.map(([clubName, data]) => (
                                        <tr key={clubName} className="border-b border-[var(--color-border)] last:border-b-0">
                                            <td className="p-2 text-right font-semibold text-[var(--color-text-primary)]">{clubName}</td>
                                            <td className="p-2 font-mono" style={{color: getCategoryInfo('male').color}}>{data.male}</td>
                                            <td className="p-2 font-mono" style={{color: getCategoryInfo('female').color}}>{data.female}</td>
                                            <td className="p-2 font-mono" style={{color: getCategoryInfo('all').color}}>{data.all}</td>
                                            <td className="p-2 font-mono font-bold text-[var(--color-text-primary)]">{data.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {announcements.length === 0 && (
                                <p className="text-[var(--color-text-secondary)] text-center py-6">لا توجد إعلانات لعرض إحصائياتها.</p>
                            )}
                         </div>
                    </div>
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
                    <span>طباعة الإحصائيات</span>
                </button>
            </div>
        </Modal>
    );
};

export default StatisticsModal;
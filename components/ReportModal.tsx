
import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { Announcement } from '../types';
import Modal from './Modal';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { PrinterIcon } from './icons/PrinterIcon';

interface ReportModalProps {
  announcements: Announcement[];
  onClose: () => void;
}

const getCategoryText = (category: 'male' | 'female' | 'all') => {
    switch (category) {
        case 'male': return 'طلاب';
        case 'female': return 'طالبات';
        case 'all': return 'طلاب وطالبات';
        default: return 'غير محدد';
    }
};

const ReportModal: React.FC<ReportModalProps> = ({ announcements, onClose }) => {
    const reportContentRef = useRef<HTMLDivElement>(null);
    const today = new Date().toISOString().split('T')[0];

    // Filters State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(today);
    const [selectedCategories, setSelectedCategories] = useState<('male' | 'female' | 'all')[]>(['male', 'female', 'all']);
    const [selectedClubs, setSelectedClubs] = useState<string[]>([]);

    const uniqueClubs = useMemo(() => {
        const clubs = new Set<string>();
        announcements.forEach(a => {
            clubs.add(a.clubName?.trim() || 'بدون نادي');
            if (a.clubName2?.trim()) {
                clubs.add(a.clubName2.trim());
            }
        });
        return Array.from(clubs).sort();
    }, [announcements]);

    // Initialize selected clubs to all unique clubs on first render
    useEffect(() => {
        setSelectedClubs(uniqueClubs);
    }, [uniqueClubs]);

    const filteredAnnouncements = useMemo(() => {
        return announcements
            .filter(ann => {
                const eventDate = new Date(ann.date);
                if (startDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    if (eventDate < start) return false;
                }
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    if (eventDate > end) return false;
                }
                return true;
            })
            .filter(ann => selectedCategories.includes(ann.category))
            .filter(ann => {
                const c1 = ann.clubName?.trim() || 'بدون نادي';
                const c2 = ann.clubName2?.trim();
                // Pass if either club1 is selected OR (club2 exists and is selected)
                return selectedClubs.includes(c1) || (c2 && selectedClubs.includes(c2));
            });
    }, [announcements, startDate, endDate, selectedCategories, selectedClubs]);
    
    const handleCategoryChange = (category: 'male' | 'female' | 'all') => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleClubChange = (clubName: string) => {
        setSelectedClubs(prev => 
            prev.includes(clubName)
                ? prev.filter(c => c !== clubName)
                : [...prev, clubName]
        );
    };

    const resetFilters = () => {
        setStartDate('');
        setEndDate(today);
        setSelectedCategories(['male', 'female', 'all']);
        setSelectedClubs(uniqueClubs);
    };

    const handlePrint = () => {
        const content = reportContentRef.current;
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
            <div className="flex flex-col md:flex-row gap-6">
                {/* Filters Section */}
                <div className="w-full md:w-1/3 bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] h-full md:max-h-[70vh] overflow-y-auto print-hide report-filters-container">
                    <h3 className="text-lg font-bold text-[var(--color-accent)] mb-4">خيارات التقرير</h3>
                    <div className="space-y-4">
                        {/* Date Range */}
                        <div>
                            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">النطاق الزمني</label>
                            <div className="flex flex-col gap-2 mt-1">
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-md p-2 text-sm" placeholder="من تاريخ"/>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-md p-2 text-sm" placeholder="إلى تاريخ"/>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">الفئة</label>
                            <div className="space-y-1 mt-1">
                                {(['male', 'female', 'all'] as const).map(cat => (
                                    <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} className="form-checkbox h-4 w-4 rounded bg-[var(--color-card-bg)] border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]" />
                                        <span>{getCategoryText(cat)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Club Filter */}
                        <div>
                            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">النادي</label>
                            <div className="space-y-1 mt-1 max-h-40 overflow-y-auto pr-1">
                                {uniqueClubs.map(club => (
                                     <label key={club} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={selectedClubs.includes(club)} onChange={() => handleClubChange(club)} className="form-checkbox h-4 w-4 rounded bg-[var(--color-card-bg)] border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]" />
                                        <span>{club}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button onClick={resetFilters} className="w-full text-sm text-center py-2 bg-[var(--color-text-secondary)]/20 rounded-md hover:bg-[var(--color-text-secondary)]/30">
                           إعادة تعيين الفلاتر
                        </button>
                    </div>
                </div>

                {/* Report Preview Section */}
                <div className="w-full md:w-2/3 report-preview-container">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-center md:text-right">
                             <h2 className="text-2xl font-bold text-[var(--color-accent)]">معاينة التقرير</h2>
                             <p className="text-[var(--color-text-secondary)]">تقرير مُنسّق جاهز للطباعة والمشاركة.</p>
                        </div>
                        <button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-md transition-all bg-[var(--color-accent)] text-white hover:brightness-90 print-hide">
                            <PrinterIcon className="w-5 h-5" />
                            <span>طباعة</span>
                        </button>
                    </div>

                    <div ref={reportContentRef} className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] h-full md:max-h-[62vh] overflow-y-auto text-right text-[var(--color-text-primary)]">
                        <div>
                            <h1 className="text-xl font-bold mb-1">تقرير الأنشطة الطلابية</h1>
                            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                                الفترة: {startDate ? new Date(startDate).toLocaleDateString('ar-EG') : 'الكل'} إلى {endDate ? new Date(endDate).toLocaleDateString('ar-EG') : 'الكل'}
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                                الإجمالي: {filteredAnnouncements.length} نشاط
                            </p>
                            <hr className="border-[var(--color-border)] mb-4" />
                        </div>
                        
                        {filteredAnnouncements.length === 0 ? (
                            <p className="text-center text-[var(--color-text-secondary)] py-8">لا توجد بيانات تطابق الفلاتر المحددة.</p>
                        ) : (
                            <table className="w-full text-sm report-table">
                                <thead className="bg-[var(--color-card-bg)]">
                                    <tr>
                                        <th className="p-2 font-semibold">النشاط</th>
                                        <th className="p-2 font-semibold">التاريخ</th>
                                        <th className="p-2 font-semibold">المكان</th>
                                        <th className="p-2 font-semibold">الفئة</th>
                                        <th className="p-2 font-semibold">النادي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAnnouncements.map(ann => {
                                         const clubDisplay = [ann.clubName, ann.clubName2]
                                            .filter(Boolean)
                                            .join(' + ');

                                        return (
                                        <tr key={ann.id} className="border-b border-[var(--color-border)]">
                                            <td className="p-2">{ann.title}</td>
                                            <td className="p-2 whitespace-nowrap">{new Date(ann.date).toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                            <td className="p-2">{ann.location}</td>
                                            <td className="p-2">{getCategoryText(ann.category)}</td>
                                            <td className="p-2 text-xs text-[var(--color-text-secondary)]">{clubDisplay}</td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
             <div className="flex justify-start mt-6 print-hide">
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

export default ReportModal;

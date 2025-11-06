import React, { useState, useEffect } from 'react';
import type { ThemeConfig } from '../types';
import Modal from './Modal';
import { ThemeIcon } from './icons/ThemeIcon';
import { availableIcons } from './icons/iconMap';
import { themePresets } from '../App';

interface ThemeModalProps {
  onClose: () => void;
  onSave: (theme: ThemeConfig) => void;
  currentTheme: ThemeConfig;
}

const titleSizeOptions = [
    { value: 'text-4xl md:text-5xl', label: 'عادي' },
    { value: 'text-5xl md:text-6xl', label: 'كبير' },
    { value: 'text-6xl md:text-7xl', label: 'كبير جداً' },
];

const titleFontOptions = [
    { value: 'Cairo', label: 'كايرو' },
    { value: 'Tajawal', label: 'تجوال' },
    { value: 'Changa', label: 'شانغا' },
];

const ThemeModal: React.FC<ThemeModalProps> = ({ onClose, onSave, currentTheme }) => {
    const [theme, setTheme] = useState<ThemeConfig>(currentTheme);

    useEffect(() => {
        setTheme(currentTheme);
    }, [currentTheme]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(theme);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'announcementExpirationHours') {
            const numValue = parseInt(value, 10);
            setTheme(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
        } else {
            setTheme(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePresetSelect = (presetId: string) => {
        const preset = themePresets[presetId];
        if (preset) {
            setTheme(prev => ({
                ...prev,
                preset: presetId,
                accentColor: preset.settings.accentColor,
            }));
        }
    };
    
    return (
        <Modal onClose={onClose} size="2xl">
            <div className="flex flex-col max-h-[85vh]">
                {/* Header Section */}
                <div className="flex-shrink-0 text-center">
                    <div className="inline-flex items-center justify-center bg-[var(--color-bg)] p-3 rounded-full mb-4">
                        <ThemeIcon className="w-8 h-8 text-[var(--color-accent)]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-blue-500">تخصيص المظهر</h2>
                    <p className="text-[var(--color-text-secondary)] mb-6">قم بتغيير شكل وألوان الموقع.</p>
                </div>
                
                {/* Form Section */}
                <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0">
                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto space-y-6 pr-4 -mr-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 text-right">تصاميم جاهزة</label>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.entries(themePresets).map(([id, preset]) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => handlePresetSelect(id)}
                                        className={`text-center p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] ${
                                            theme.preset === id
                                            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                                            : `border-[var(--color-border)] hover:border-[var(--color-text-secondary)]`
                                        }`}
                                    >
                                        <span 
                                            className="block w-6 h-6 rounded-full mx-auto mb-2" 
                                            style={{ 
                                                backgroundColor: preset.settings.accentColor, 
                                                border: `2px solid ${preset.settings['--color-border']}` 
                                            }}
                                        />
                                        <span className="text-xs text-[var(--color-text-primary)]">{preset.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1 text-right">عنوان الموقع</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={theme.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
                            />
                        </div>

                        <div>
                            <label htmlFor="subtitle" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1 text-right">العنوان الفرعي</label>
                            <input
                                id="subtitle"
                                name="subtitle"
                                type="text"
                                value={theme.subtitle}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
                            />
                        </div>

                        <div>
                            <label htmlFor="announcementExpirationHours" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1 text-right">مدة صلاحية الإعلان (بالساعات)</label>
                            <p className="text-xs text-right text-[var(--color-text-secondary)] mb-2">
                                بعد مرور هذا الوقت على تاريخ الفعالية، سيتم إخفاء الإعلان. أدخل 0 لعدم إخفاء الإعلانات تلقائياً.
                            </p>
                            <input
                                id="announcementExpirationHours"
                                name="announcementExpirationHours"
                                type="number"
                                min="0"
                                value={theme.announcementExpirationHours}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-[var(--color-text-primary)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 text-right">خط العنوان</label>
                            <div className="flex justify-center gap-2 p-1 bg-[var(--color-bg)] rounded-md">
                                {titleFontOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setTheme(prev => ({...prev, titleFont: option.value}))}
                                        className={`w-full py-2 px-4 rounded-md text-sm transition-colors ${theme.titleFont === option.value ? 'bg-[var(--color-accent)] text-white font-bold' : `hover:bg-[var(--color-border)]`}`}
                                        style={{ fontFamily: `'${option.value}', sans-serif` }}
                                    >{option.label}</button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 text-right">حجم العنوان</label>
                            <div className="flex justify-center gap-2 p-1 bg-[var(--color-bg)] rounded-md">
                                {titleSizeOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setTheme(prev => ({...prev, titleSize: option.value as ThemeConfig['titleSize']}))}
                                        className={`w-full py-2 px-4 rounded-md text-sm transition-colors ${theme.titleSize === option.value ? 'bg-[var(--color-accent)] text-white font-bold' : `hover:bg-[var(--color-border)]`}`}
                                    >{option.label}</button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 text-right">أيقونة الرأسية</label>
                            <div className="flex flex-wrap justify-center gap-3">
                                {availableIcons.map((icon) => {
                                const IconComponent = icon.component;
                                const isSelected = theme.headerIcon === icon.id;
                                return (
                                    <button
                                        key={icon.id}
                                        type="button"
                                        onClick={() => setTheme(prev => ({...prev, headerIcon: icon.id}))}
                                        className={`p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] ${
                                            isSelected
                                            ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]'
                                            : `bg-[var(--color-bg)] border-[var(--color-border)] hover:border-[var(--color-text-secondary)]`
                                        }`}
                                        aria-label={`اختر أيقونة ${icon.name}`}
                                    >
                                        <IconComponent className={`w-6 h-6 ${isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`} />
                                    </button>
                                );
                                })}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="accentColor" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1 text-right">اللون الأساسي</label>
                            <div className="flex items-center gap-4 p-2 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-md">
                                <input
                                    id="accentColor"
                                    name="accentColor"
                                    type="color"
                                    value={theme.accentColor}
                                    onChange={handleInputChange}
                                    className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={theme.accentColor}
                                    onChange={handleInputChange}
                                    name="accentColor"
                                    className="w-full bg-[var(--color-card-bg)] px-3 py-1 rounded-md text-center text-[var(--color-text-primary)] border border-transparent focus:border-[var(--color-accent)] focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex justify-end gap-4 pt-4 mt-6 border-t border-[var(--color-border)]">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors">
                            إلغاء
                        </button>
                        <button type="submit" className="px-6 py-2 bg-[var(--color-accent)] text-white font-semibold rounded-md hover:brightness-90 transition-all">
                            حفظ التغييرات
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ThemeModal;
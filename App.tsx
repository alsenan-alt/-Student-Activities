import React, { useState, useEffect, useCallback } from 'react';
import type { LinkItem, UserRole, ToastMessage, ThemeConfig } from './types';
import Header from './components/Header';
import LinkList from './components/LinkList';
import AddLinkForm from './components/AddLinkForm';
import Modal from './components/Modal';
import { PlusIcon } from './components/icons/PlusIcon';
import RoleSwitcher from './components/RoleSwitcher';
import PasswordModal from './components/PasswordModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import { KeyIcon } from './components/icons/KeyIcon';
import ToastContainer from './components/ToastContainer';
import SearchBar from './components/SearchBar';
import { ThemeIcon } from './components/icons/ThemeIcon';
import ThemeModal from './components/ThemeModal';
import { ExportIcon } from './components/icons/ExportIcon';
import { ImportIcon } from './components/icons/ImportIcon';

export const themePresets: { [key: string]: { name: string; settings: { [key: string]: string } } } = {
  default: {
    name: 'الوضع المظلم',
    settings: {
      accentColor: '#14b8a6',
      '--color-bg': '#111827',
      '--color-card-bg': '#1f2937',
      '--color-text-primary': '#f9fafb',
      '--color-text-secondary': '#9ca3af',
      '--color-border': 'rgba(255, 255, 255, 0.1)',
    },
  },
  light: {
    name: 'الوضع المضيء',
    settings: {
      accentColor: '#0ea5e9',
      '--color-bg': '#f3f4f6',
      '--color-card-bg': '#ffffff',
      '--color-text-primary': '#1f2937',
      '--color-text-secondary': '#6b7280',
      '--color-border': 'rgba(0, 0, 0, 0.1)',
    },
  },
  synthwave: {
    name: 'الموجة الليلية',
    settings: {
      accentColor: '#f472b6',
      '--color-bg': '#2d3748',
      '--color-card-bg': '#1a202c',
      '--color-text-primary': '#e2e8f0',
      '--color-text-secondary': '#a0aec0',
      '--color-border': 'rgba(244, 114, 182, 0.2)',
    },
  },
  ocean: {
    name: 'نسيم المحيط',
    settings: {
      accentColor: '#3b82f6',
      '--color-bg': '#f0f9ff',
      '--color-card-bg': '#ffffff',
      '--color-text-primary': '#075985',
      '--color-text-secondary': '#374151',
      '--color-border': 'rgba(59, 130, 246, 0.2)',
    },
  },
  emerald: {
    name: 'زمرد الغابة',
    settings: {
      accentColor: '#10b981',
      '--color-bg': '#0f172a',
      '--color-card-bg': '#1e293b',
      '--color-text-primary': '#f1f5f9',
      '--color-text-secondary': '#94a3b8',
      '--color-border': 'rgba(16, 185, 129, 0.2)',
    },
  },
  gold: {
    name: 'الذهب الملكي',
    settings: {
      accentColor: '#f59e0b',
      '--color-bg': '#18181b',
      '--color-card-bg': '#27272a',
      '--color-text-primary': '#f4f4f5',
      '--color-text-secondary': '#a1a1aa',
      '--color-border': 'rgba(245, 158, 11, 0.2)',
    },
  },
};

const App: React.FC = () => {
    
    const getInitialLinks = (): LinkItem[] => {
        try {
            const savedLinks = localStorage.getItem('studentActivityLinks');
            if (savedLinks) {
                return JSON.parse(savedLinks);
            }
        } catch (error) {
            console.error("Failed to parse links from localStorage", error);
        }
        return [
            { id: 1, title: 'نموذج تسجيل الأنشطة', url: 'https://forms.example.com/registration', icon: 'document', description: 'استخدم هذا النموذج لتسجيل اسمك في الأنشطة الطلابية المتاحة.' },
            { id: 2, title: 'جدول الفعاليات', url: 'https://calendar.example.com/events', icon: 'calendar', description: 'اطلع على جدول ومواعيد جميع الفعاليات والأنشطة القادمة.' },
            { id: 3, title: 'تواصل مع المشرف', url: 'https://contact.example.com/supervisor', icon: 'chat', description: 'قناة مباشرة للتواصل مع مشرف النشاط للإجابة على استفساراتكم.' },
        ];
    };

    const getInitialTheme = (): ThemeConfig => {
        try {
            const savedTheme = localStorage.getItem('studentActivityTheme');
            if (savedTheme) {
                return JSON.parse(savedTheme);
            }
        } catch (error) {
            console.error("Failed to parse theme from localStorage", error);
        }
        return {
            title: "إدارة النشاط الطلابي",
            subtitle: "مكانك المركزي لإدارة جميع روابط النشاط الطلابي",
            titleSize: 'text-4xl md:text-5xl',
            headerIcon: 'link',
            accentColor: '#14b8a6',
            preset: 'default',
            titleFont: 'Tajawal',
        };
    };

    // --- STATE & REFS ---
    const [links, setLinks] = useState<LinkItem[]>(getInitialLinks);
    const [themeConfig, setThemeConfig] = useState<ThemeConfig>(getInitialTheme);
    const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('studentActivityPassword') || 'admin');
    const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
    const [userRole, setUserRole] = useState<UserRole>('student');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    
    // --- CALLBACKS & HELPER FUNCTIONS ---

    const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    }, []);

    
    // --- EFFECTS ---
    useEffect(() => {
        try {
            localStorage.setItem('studentActivityLinks', JSON.stringify(links));
            localStorage.setItem('studentActivityTheme', JSON.stringify(themeConfig));
            localStorage.setItem('studentActivityPassword', adminPassword);
        } catch (error) {
            console.error("Failed to save to localStorage", error);
        }
    }, [links, themeConfig, adminPassword]);
    
    useEffect(() => {
        try {
            const presetSettings = themePresets[themeConfig.preset]?.settings || themePresets.default.settings;
            for (const [key, value] of Object.entries(presetSettings)) {
                if (key !== 'accentColor') {
                    document.documentElement.style.setProperty(key, value);
                }
            }
            document.documentElement.style.setProperty('--color-accent', themeConfig.accentColor);
        } catch (error) {
            console.error("Failed to apply theme", error);
        }
    }, [themeConfig]);
    
    // --- EVENT HANDLERS ---
    const handleExport = () => {
        try {
            const appData = {
                links,
                themeConfig,
                adminPassword,
            };
            const jsonString = JSON.stringify(appData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'student-activity-data.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            addToast('تم تصدير الإعدادات بنجاح.');
        } catch (error) {
            console.error('Failed to export data', error);
            addToast('حدث خطأ أثناء تصدير الإعدادات.', 'error');
        }
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const result = e.target?.result;
                        if (typeof result === 'string') {
                            const data = JSON.parse(result);
                            // Basic validation
                            if (data && Array.isArray(data.links) && data.themeConfig && typeof data.adminPassword === 'string') {
                                setLinks(data.links);
                                setThemeConfig(data.themeConfig);
                                setAdminPassword(data.adminPassword);
                                addToast('تم استيراد الإعدادات بنجاح.');
                            } else {
                                throw new Error('Invalid file structure.');
                            }
                        }
                    } catch (error) {
                        console.error('Failed to parse imported file', error);
                        addToast('فشل استيراد الملف. تأكد من أن الملف صحيح.', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const removeToast = (id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    const handleSaveLink = (id: number | null, title: string, url: string, icon: string, description: string) => {
        if (id !== null) {
            setLinks(prevLinks =>
                prevLinks.map(link =>
                    link.id === id ? { ...link, title, url, icon, description } : link
                )
            );
            addToast('تم تحديث الرابط بنجاح!');
        } else {
            const newLink: LinkItem = {
                id: Date.now(),
                title,
                url,
                icon,
                description,
            };
            setLinks(prevLinks => [...prevLinks, newLink]);
            addToast('تمت إضافة الرابط بنجاح!');
        }
        closeLinkForm();
    };

    const handleDeleteLink = (id: number) => {
        setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
        addToast('تم حذف الرابط بنجاح!');
    };

    const handleReorderLinks = (reorderedLinks: LinkItem[]) => {
        setLinks(reorderedLinks);
        addToast('تم تحديث ترتيب الروابط.');
    };
    
    const openAddForm = () => {
        setEditingLink(null);
        setIsLinkFormOpen(true);
    };

    const openEditForm = (link: LinkItem) => {
        setEditingLink(link);
        setIsLinkFormOpen(true);
    };
    
    const closeLinkForm = () => {
        setIsLinkFormOpen(false);
        setEditingLink(null);
    };

    const handleRoleChangeRequest = (role: UserRole) => {
        if (role === 'student') {
            setUserRole('student');
        } else if (userRole !== 'admin') {
            setIsPasswordModalOpen(true);
        }
    };

    const handlePasswordVerification = (password: string): boolean => {
        if (password === adminPassword) {
            setUserRole('admin');
            setIsPasswordModalOpen(false);
            addToast('تم تسجيل الدخول كمسؤول بنجاح.');
            return true;
        }
        addToast('كلمة المرور غير صحيحة.', 'error');
        return false;
    };

    const handleChangePassword = (current: string, newPass: string): string | null => {
        if (current !== adminPassword) {
            return 'كلمة المرور الحالية غير صحيحة.';
        }
        setAdminPassword(newPass);
        setChangePasswordModalOpen(false);
        addToast('تم تغيير كلمة المرور بنجاح!');
        return null;
    };

    const handleSaveTheme = (newTheme: ThemeConfig) => {
        setThemeConfig(newTheme);
        setIsThemeModalOpen(false);
        addToast('تم تحديث مظهر الموقع بنجاح!');
    };
    
    // --- RENDER LOGIC ---

    const filteredLinks = links.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
            <div className="container mx-auto max-w-5xl">
                <Header 
                    title={themeConfig.title} 
                    subtitle={themeConfig.subtitle} 
                    titleSize={themeConfig.titleSize} 
                    headerIcon={themeConfig.headerIcon}
                    titleFont={themeConfig.titleFont} 
                />
                <RoleSwitcher currentRole={userRole} onRoleChange={handleRoleChangeRequest} />
                <main>
                    <div className="mb-8">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    }

                    {userRole === 'admin' && (
                        <div className="mb-8 flex flex-col items-center gap-4">
                            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
                                <button
                                    onClick={openAddForm}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-semibold rounded-md hover:brightness-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-accent)] shadow-lg hover:shadow-[var(--color-accent)]/30 transform hover:-translate-y-0.5"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    <span>إضافة رابط جديد</span>
                                </button>
                                 <button
                                    onClick={() => setChangePasswordModalOpen(true)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-card-bg)] text-[var(--color-text-primary)] font-semibold rounded-md hover:brightness-125 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-text-secondary)] shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <KeyIcon className="w-5 h-5" />
                                    <span>تغيير كلمة المرور</span>
                                </button>
                                <button
                                    onClick={() => setIsThemeModalOpen(true)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-card-bg)] text-[var(--color-text-primary)] font-semibold rounded-md hover:brightness-125 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-text-secondary)] shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <ThemeIcon className="w-5 h-5" />
                                    <span>تخصيص المظهر</span>
                                </button>
                            </div>
                            
                           <div className="w-full max-w-md p-4 mt-4 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-center">
                                <h3 className="font-bold text-lg mb-2 text-[var(--color-text-primary)]">إدارة البيانات</h3>
                                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                                    حفظ أو استعادة جميع إعدادات الموقع من ملف واحد.
                                </p>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleImport}
                                        className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] focus:ring-sky-500 shadow-md"
                                    >
                                        <ImportIcon className="w-5 h-5" />
                                        <span>استيراد الإعدادات</span>
                                    </button>
                                     <button 
                                        onClick={handleExport}
                                        className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] focus:ring-emerald-500 shadow-md"
                                    >
                                        <ExportIcon className="w-5 h-5" />
                                        <span>تصدير الإعدادات</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="border-t border-[var(--color-border)] pt-8">
                      <LinkList 
                        links={filteredLinks} 
                        onDelete={handleDeleteLink} 
                        onEdit={openEditForm}
                        onReorder={handleReorderLinks}
                        userRole={userRole}
                        searchQuery={searchQuery} 
                      />
                    </div>
                </main>
                <footer className="text-center text-[var(--color-text-secondary)] mt-12 py-4">
                    <p>&copy; {new Date().getFullYear()} {themeConfig.title}. كل الحقوق محفوظة.</p>
                </footer>
            </div>

            {isLinkFormOpen && (
                <Modal onClose={closeLinkForm}>
                    <AddLinkForm 
                        onSave={handleSaveLink} 
                        onClose={closeLinkForm}
                        existingLink={editingLink}
                    />
                </Modal>
            )}

            {isPasswordModalOpen && (
                <PasswordModal 
                    onClose={() => setIsPasswordModalOpen(false)} 
                    onVerify={handlePasswordVerification} 
                />
            )}

            {isChangePasswordModalOpen && (
                <ChangePasswordModal
                    onClose={() => setChangePasswordModalOpen(false)}
                    onChangePassword={handleChangePassword}
                />
            )}

            {isThemeModalOpen && (
                <ThemeModal 
                    onClose={() => setIsThemeModalOpen(false)}
                    onSave={handleSaveTheme}
                    currentTheme={themeConfig}
                />
            )}
        </div>
    );
};

export default App;
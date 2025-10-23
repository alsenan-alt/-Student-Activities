import React, { useState, useEffect, useRef } from 'react';
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
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
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
            accentColor: '#14b8a6', // Default teal-500
            preset: 'default',
            titleFont: 'Tajawal',
        };
    };

    const [links, setLinks] = useState<LinkItem[]>(getInitialLinks);
    const [themeConfig, setThemeConfig] = useState<ThemeConfig>(getInitialTheme);
    const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
    const [userRole, setUserRole] = useState<UserRole>('student');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // In a real application, this would be managed securely on a server.
    // For this frontend-only example, we use state that resets on refresh.
    const [adminPassword, setAdminPassword] = useState('admin');

    useEffect(() => {
        try {
            localStorage.setItem('studentActivityLinks', JSON.stringify(links));
        } catch (error) {
            console.error("Failed to save links to localStorage", error);
        }
    }, [links]);

    useEffect(() => {
        try {
            localStorage.setItem('studentActivityTheme', JSON.stringify(themeConfig));
            
            const presetSettings = themePresets[themeConfig.preset]?.settings || themePresets.default.settings;
            for (const [key, value] of Object.entries(presetSettings)) {
                if (key !== 'accentColor') {
                    document.documentElement.style.setProperty(key, value);
                }
            }
            
            document.documentElement.style.setProperty('--color-accent', themeConfig.accentColor);

        } catch (error) {
            console.error("Failed to save or apply theme to localStorage", error);
        }
    }, [themeConfig]);

    const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    };
    
    const removeToast = (id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    const handleSaveLink = (id: number | null, title: string, url: string, icon: string, description: string) => {
        if (id !== null) { // Update existing link
            setLinks(prevLinks =>
                prevLinks.map(link =>
                    link.id === id ? { ...link, title, url, icon, description } : link
                )
            );
            addToast('تم تحديث الرابط بنجاح!');
        } else { // Add new link
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

    const handleExport = () => {
        try {
            const exportData = {
                links,
                themeConfig,
                adminPassword,
            };
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            const date = new Date().toISOString().slice(0, 10);
            link.download = `student-activity-config-${date}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
            addToast('تم تصدير الإعدادات بنجاح!');
        } catch (error) {
            console.error("Failed to export settings", error);
            addToast('فشل تصدير الإعدادات.', 'error');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error('محتوى الملف غير قابل للقراءة.');
                }
                const importedData = JSON.parse(text);

                if (
                    !importedData.links || 
                    !importedData.themeConfig || 
                    !importedData.adminPassword ||
                    !Array.isArray(importedData.links)
                ) {
                    throw new Error('ملف الإعدادات غير صالح أو تالف.');
                }
                
                setLinks(importedData.links);
                setThemeConfig(importedData.themeConfig);
                setAdminPassword(importedData.adminPassword);

                addToast('تم استيراد الإعدادات بنجاح!');
            } catch (error) {
                console.error("Failed to import settings", error);
                const errorMessage = error instanceof Error ? error.message : 'فشل استيراد الإعدادات. الرجاء التأكد من أن الملف صحيح.';
                addToast(errorMessage, 'error');
            } finally {
                if (event.target) {
                    event.target.value = '';
                }
            }
        };
        reader.onerror = () => {
             addToast('حدث خطأ أثناء قراءة الملف.', 'error');
             if (event.target) {
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    const filteredLinks = links.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                style={{ display: 'none' }}
                aria-hidden="true"
            />
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
                    </div>

                    {userRole === 'admin' && (
                        <div className="mb-8 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
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
                             <button
                                onClick={handleImportClick}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-card-bg)] text-[var(--color-text-primary)] font-semibold rounded-md hover:brightness-125 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-text-secondary)] shadow-lg transform hover:-translate-y-0.5"
                            >
                                <ImportIcon className="w-5 h-5" />
                                <span>استيراد الإعدادات</span>
                            </button>
                            <button
                                onClick={handleExport}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-card-bg)] text-[var(--color-text-primary)] font-semibold rounded-md hover:brightness-125 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-text-secondary)] shadow-lg transform hover:-translate-y-0.5"
                            >
                                <ExportIcon className="w-5 h-5" />
                                <span>تصدير الإعدادات</span>
                            </button>
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
import React, { useState, useEffect, useCallback } from 'react';
import type { LinkItem, UserRole, ToastMessage, ThemeConfig, Announcement } from './types';
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
import DataSourceStatus from './components/DataSourceStatus';
import ViewSwitcher from './components/ViewSwitcher';
import AnnouncementList from './components/AnnouncementList';
import AnnouncementForm from './components/AnnouncementForm';
import ImageModal from './components/ImageModal';
import Pagination from './components/Pagination';
import AnnouncementFilters from './components/AnnouncementFilters';
import { RefreshIcon } from './components/icons/RefreshIcon';

const DATA_SOURCE_URL = 'https://gist.githubusercontent.com/alsenan-alt/90667b2526764f93d35e6328b72d0c4b/raw/student-activity-data.json'; 

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

const DEFAULT_DATA = {
    links: [
        { id: 1, title: 'نموذج تسجيل الأنشطة', url: 'https://forms.example.com/registration', icon: 'document', description: 'استخدم هذا النموذج لتسجيل اسمك في الأنشطة الطلابية المتاحة.' },
        { id: 2, title: 'جدول الفعاليات', url: 'https://calendar.example.com/events', icon: 'calendar', description: 'اطلع على جدول ومواعيد جميع الفعاليات والأنشطة القادمة.' },
        { id: 3, title: 'تواصل مع المشرف', url: 'https://contact.example.com/supervisor', icon: 'chat', description: 'قناة مباشرة للتواصل مع مشرف النشاط للإجابة على استفساراتكم.' },
    ],
    announcements: [
        {
            id: 1,
            title: 'ورشة عمل البرمجة التنافسية',
            category: 'male' as const,
            imageUrl: 'https://placehold.co/600x400/14b8a6/white?text=Programming',
            details: 'انضم إلينا لتعلم أساسيات البرمجة التنافسية وحل المشكلات المعقدة. الورشة مناسبة للمبتدئين والمتقدمين.',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'معمل الحاسب الآلي - مبنى 5',
            registrationType: 'link' as const,
            registrationUrl: 'https://forms.example.com/programming-workshop'
        },
        {
            id: 2,
            title: 'معرض الفنون والإبداع السنوي',
            category: 'female' as const,
            imageUrl: 'https://placehold.co/600x400/f472b6/white?text=Art+Fair',
            details: 'ندعو جميع الطالبات المبدعات للمشاركة وعرض أعمالهن الفنية في المعرض السنوي. جوائز قيمة بانتظاركم.',
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'قاعة المعارض - مبنى الأنشطة',
            registrationType: 'link' as const,
            registrationUrl: 'https://forms.example.com/art-fair'
        },
        {
            id: 3,
            title: 'اليوم الرياضي المفتوح',
            category: 'male' as const,
            imageUrl: 'https://placehold.co/600x400/3b82f6/white?text=Sports+Day',
            details: 'يوم مليء بالأنشطة الرياضية والمسابقات. شارك في كرة القدم، السلة، والمزيد!',
            date: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
            location: 'الملاعب الرياضية',
            registrationType: 'open' as const,
        }
    ],
    themeConfig: {
        title: "إدارة النشاط الطلابي",
        subtitle: "مكانك المركزي لإدارة جميع روابط النشاط الطلابي",
        titleSize: 'text-4xl md:text-5xl' as ThemeConfig['titleSize'],
        headerIcon: 'link',
        accentColor: '#14b8a6',
        preset: 'default',
        titleFont: 'Tajawal',
    },
    adminPassword: 'admin'
};

const ITEMS_PER_PAGE = 6;
const ANNOUNCEMENT_EXPIRATION_HOURS = 4;

const App: React.FC = () => {
    // --- STATE & REFS ---
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
    const [adminPassword, setAdminPassword] = useState<string>('admin');
    const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
    const [isAnnouncementFormOpen, setIsAnnouncementFormOpen] = useState(false);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [userRole, setUserRole] = useState<UserRole>('student');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [announcementSearchQuery, setAnnouncementSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'links' | 'announcements'>('announcements');
    const [announcementCategory, setAnnouncementCategory] = useState<'male' | 'female'>('male');
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showTodaysAnnouncements, setShowTodaysAnnouncements] = useState(false);


    // --- CALLBACKS & HELPER FUNCTIONS ---
    const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    }, []);
    
    // --- CORE APP LOGIC ---

    const loadInitialData = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        let errorMessage: string | null = null;
        let success = false;

        try {
            if (DATA_SOURCE_URL) {
                const response = await fetch(`${DATA_SOURCE_URL}?cachebust=${new Date().getTime()}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        errorMessage = 'فشل الاتصال: لم يتم العثور على الملف على الرابط (خطأ 404). الرجاء التأكد من صحة الرابط.';
                    } else {
                        errorMessage = `فشل الاتصال بالخادم (خطأ ${response.status}).`;
                    }
                } else {
                    const serverData = await response.json();
                    if (serverData && serverData.links && serverData.themeConfig) {
                        setLinks(serverData.links);
                        setAnnouncements(serverData.announcements || []);
                        setThemeConfig(serverData.themeConfig);
                        setAdminPassword(serverData.adminPassword || 'admin');
                        localStorage.setItem('studentActivityData', JSON.stringify(serverData));
                        console.log("Data loaded successfully from Gist.");
                        setFetchError(null);
                        success = true;
                    } else {
                       errorMessage = 'البيانات المستلمة من الرابط غير صالحة.';
                    }
                }
            } else {
                errorMessage = 'لم يتم تكوين رابط مصدر البيانات. يتم عرض البيانات المحلية.';
            }
        } catch (error) {
            console.error("Could not fetch/parse server data, falling back to local.", error);
            errorMessage = 'حدث خطأ في الشبكة أو في تحليل البيانات. سيتم عرض آخر نسخة محفوظة.';
        }

        if (errorMessage && !success) {
            setFetchError(errorMessage);
            if (!isRefresh) addToast(errorMessage, "error");

            // Priority 2: Fallback to localStorage
            try {
                const localDataString = localStorage.getItem('studentActivityData');
                if (localDataString) {
                    const localData = JSON.parse(localDataString);
                    if (localData && localData.links && localData.themeConfig) {
                        setLinks(localData.links);
                        setAnnouncements(localData.announcements || []);
                        setThemeConfig(localData.themeConfig);
                        setAdminPassword(localData.adminPassword || 'admin');
                         console.log("Data loaded successfully from localStorage.");
                         success = true; // يعتبر نجاحا لأنه حمل البيانات المخزنة
                    }
                }
            } catch (error) {
                console.error("Could not parse local data.", error);
            }
        }
        
        if(!success) {
             // Priority 3: Fallback to hardcoded defaults
            console.log("Falling back to default data.");
            setLinks(DEFAULT_DATA.links);
            setAnnouncements(DEFAULT_DATA.announcements);
            setThemeConfig(DEFAULT_DATA.themeConfig);
            setAdminPassword(DEFAULT_DATA.adminPassword);
        }

        if (isRefresh) {
            if (success) {
                addToast('تم تحديث البيانات بنجاح.');
            } else {
                addToast('فشل تحديث البيانات. تحقق من اتصالك بالإنترنت.', 'error');
            }
            setIsRefreshing(false);
        } else {
            setIsLoading(false);
        }
    }, [addToast]);

    // Effect for loading initial data on mount
    useEffect(() => {
        loadInitialData(false);
    }, [loadInitialData]);

    // Effect for saving data to localStorage on changes (admin's draft)
    useEffect(() => {
        if (!isLoading && themeConfig && userRole === 'admin') {
            try {
                const appData = { links, announcements, themeConfig, adminPassword };
                localStorage.setItem('studentActivityData', JSON.stringify(appData));
            } catch (error) {
                console.error("Failed to save to localStorage", error);
            }
        }
    }, [links, announcements, themeConfig, adminPassword, isLoading, userRole]);
    
    // Effect for applying theme
    useEffect(() => {
        if (themeConfig) {
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
        }
    }, [themeConfig]);

    // Effect to reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [announcementCategory, activeView, showTodaysAnnouncements, announcementSearchQuery]);
    
    
    // --- EVENT HANDLERS ---
    const handleExport = () => {
        if (!themeConfig) return;
        try {
            const appData = { links, announcements, themeConfig, adminPassword };
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
                            if (data && Array.isArray(data.links) && data.themeConfig && typeof data.adminPassword === 'string') {
                                setLinks(data.links);
                                setAnnouncements(data.announcements || []);
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
            const newLink: LinkItem = { id: Date.now(), title, url, icon, description };
            setLinks(prevLinks => [...prevLinks, newLink]);
            addToast('تمت إضافة الرابط بنجاح!');
        }
        closeLinkForm();
    };
    
    const handleSaveAnnouncement = (announcementData: Omit<Announcement, 'id'>, id: number | null) => {
        if (id !== null) {
            setAnnouncements(prev => 
                prev.map(ann => ann.id === id ? { ...ann, ...announcementData } : ann)
            );
            addToast('تم تحديث الإعلان بنجاح!');
        } else {
            const newAnnouncement: Announcement = { id: Date.now(), ...announcementData };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
            addToast('تمت إضافة الإعلان بنجاح!');
        }
        closeAnnouncementForm();
    };

    const handleDeleteLink = (id: number) => {
        setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
        addToast('تم حذف الرابط بنجاح!');
    };

    const handleDeleteAnnouncement = (id: number) => {
        setAnnouncements(prev => prev.filter(ann => ann.id !== id));
        addToast('تم حذف الإعلان.');
    };

    const handleReorderLinks = (reorderedLinks: LinkItem[]) => {
        setLinks(reorderedLinks);
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

    const openAddAnnouncementForm = () => {
        setEditingAnnouncement(null);
        setIsAnnouncementFormOpen(true);
    };

    const openEditAnnouncementForm = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsAnnouncementFormOpen(true);
    };
    
    const closeAnnouncementForm = () => {
        setIsAnnouncementFormOpen(false);
        setEditingAnnouncement(null);
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
        if (current !== adminPassword) return 'كلمة المرور الحالية غير صحيحة.';
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

    if (isLoading || !themeConfig) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    const filteredLinks = links.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredAnnouncements = announcements
        .filter(ann => ann.category === announcementCategory)
        .filter(ann => {
            const eventDate = new Date(ann.date);
            const expirationTime = new Date(eventDate.getTime() + ANNOUNCEMENT_EXPIRATION_HOURS * 60 * 60 * 1000);
            return new Date() <= expirationTime;
        })
        .filter(ann => {
            if (!showTodaysAnnouncements) {
                return true;
            }
            const eventDate = new Date(ann.date);
            const today = new Date();
            return (
                eventDate.getFullYear() === today.getFullYear() &&
                eventDate.getMonth() === today.getMonth() &&
                eventDate.getDate() === today.getDate()
            );
        })
        .filter(ann => {
            if (!announcementSearchQuery) return true;
            const query = announcementSearchQuery.toLowerCase();
            return (
                ann.title.toLowerCase().includes(query) ||
                ann.details.toLowerCase().includes(query)
            );
        });

    const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
    const paginatedAnnouncements = filteredAnnouncements.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
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
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <ViewSwitcher activeView={activeView} onSwitch={setActiveView} />
                        <button
                            onClick={() => loadInitialData(true)}
                            disabled={isRefreshing}
                            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-full hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-secondary)] transition-colors disabled:opacity-50 disabled:cursor-wait"
                            aria-label="تحديث البيانات"
                        >
                            <RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">{isRefreshing ? 'جاري التحديث...' : 'تحديث'}</span>
                        </button>
                    </div>

                    {activeView === 'links' && (
                        <>
                            <div className="mb-8">
                                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="ابحث عن رابط..." />
                            </div>

                            {userRole === 'admin' && (
                                <div className="mb-8 flex flex-col items-center gap-6">
                                    <button
                                        onClick={openAddForm}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-semibold rounded-md hover:brightness-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-accent)] shadow-lg hover:shadow-[var(--color-accent)]/30 transform hover:-translate-y-0.5"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        <span>إضافة رابط جديد</span>
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
                        </>
                    )}
                    
                    {activeView === 'announcements' && (
                        <div>
                            <AnnouncementFilters
                                category={announcementCategory}
                                onCategoryChange={setAnnouncementCategory}
                                searchQuery={announcementSearchQuery}
                                onSearchChange={setAnnouncementSearchQuery}
                                showTodays={showTodaysAnnouncements}
                                onShowTodaysChange={setShowTodaysAnnouncements}
                            />
                            
                            {userRole === 'admin' && (
                                <div className="mb-8 flex justify-center">
                                     <button
                                        onClick={openAddAnnouncementForm}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-semibold rounded-md hover:brightness-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-accent)] shadow-lg hover:shadow-[var(--color-accent)]/30 transform hover:-translate-y-0.5"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        <span>إضافة إعلان جديد</span>
                                    </button>
                                </div>
                            )}

                             <AnnouncementList 
                                announcements={paginatedAnnouncements}
                                userRole={userRole}
                                onDelete={handleDeleteAnnouncement}
                                onEdit={openEditAnnouncementForm}
                                onImageClick={setViewingImage}
                                searchQuery={announcementSearchQuery}
                             />
                             {totalPages > 1 && (
                                <div className="mt-8">
                                    <Pagination 
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                             )}
                        </div>
                    )}


                    {userRole === 'admin' && (
                        <div className="mt-16 pt-8 border-t border-[var(--color-border)] flex flex-col items-center gap-6">
                             <DataSourceStatus url={DATA_SOURCE_URL} isLoading={isRefreshing || isLoading} error={fetchError} />
                            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
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

                            <div className="w-full max-w-xl p-4 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-center">
                                <h3 className="font-bold text-lg mb-2 text-[var(--color-text-primary)]">تحديث المحتوى للطلاب (نشر)</h3>
                                <div className="flex gap-4 mb-4">
                                    <button onClick={handleImport} className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors">
                                        <ImportIcon className="w-5 h-5" />
                                        <span>استيراد (استعادة)</span>
                                    </button>
                                     <button onClick={handleExport} className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors">
                                        <ExportIcon className="w-5 h-5" />
                                        <span>تصدير (للتحديث)</span>
                                    </button>
                                </div>
                                <div className="text-xs text-right text-[var(--color-text-secondary)] bg-[var(--color-bg)] p-3 rounded-md">
                                    <h4 className="font-bold text-sm text-[var(--color-text-primary)] mb-1">خطوات النشر للطلاب:</h4>
                                    <ol className="list-decimal list-inside space-y-1 pr-4">
                                        <li>اضغط <strong>"تصدير"</strong> لتنزيل ملف <code className="text-xs bg-[var(--color-border)] px-1 rounded">.json</code>.</li>
                                        <li>اذهب إلى Gist الخاص بك على GitHub.</li>
                                        <li>اضغط <strong>"Edit"</strong>، احذف المحتوى القديم، ثم الصق المحتوى الجديد.</li>
                                        <li className="font-bold text-amber-400">اضغط <strong>"Update public gist"</strong> لحفظ التغييرات.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    )}
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

             {isAnnouncementFormOpen && (
                <Modal onClose={closeAnnouncementForm}>
                    <AnnouncementForm
                        onSave={handleSaveAnnouncement}
                        onClose={closeAnnouncementForm}
                        existingAnnouncement={editingAnnouncement}
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

            {viewingImage && (
                <ImageModal
                    imageUrl={viewingImage}
                    altText="صورة الإعلان"
                    onClose={() => setViewingImage(null)}
                />
            )}
        </div>
    );
};

export default App;

import React, { useState, useEffect, useCallback } from 'react';
import type { LinkItem, UserRole, ToastMessage, ThemeConfig, Announcement } from './types';
import LinkList from './components/LinkList';
import AddLinkForm from './components/AddLinkForm';
import Modal from './components/Modal';
import { PlusIcon } from './components/icons/PlusIcon';
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
import AnnouncementList from './components/AnnouncementList';
import AnnouncementForm from './components/AnnouncementForm';
import ImageModal from './components/ImageModal';
import Pagination from './components/Pagination';
import { RefreshIcon } from './components/icons/RefreshIcon';
import { ChartBarIcon } from './components/icons/ChartBarIcon';
import StatisticsModal from './components/StatisticsModal';
import { DocumentTextIcon } from './components/icons/DocumentTextIcon';
import ReportModal from './components/ReportModal';
import Header from './components/Header';
import RoleSwitcher from './components/RoleSwitcher';
import ViewSwitcher from './components/ViewSwitcher';
import AnnouncementFilters from './components/AnnouncementFilters';
import { CalendarDaysIcon } from './components/icons/CalendarDaysIcon';
import DailyAnnouncementsModal from './components/DailyAnnouncementsModal';
import ConfirmationModal from './components/ConfirmationModal';
import { DocumentPlusIcon } from './components/icons/DocumentPlusIcon';
import BulkAnnouncementModal from './components/BulkAnnouncementModal';

const DATA_SOURCE_URL = 'https://gist.githubusercontent.com/alsenan-alt/90667b2526764f93d35e6328b72d0c4b/raw/student-activity-data.json'; 

export const themePresets: { [key: string]: { name: string; settings: { [key: string]: string } } } = {
  dark: {
    name: 'الوضع الداكن',
    settings: {
      accentColor: '#2dd4bf',
      titleColor: '#ffffff',
      subtitleColor: '#e2e8f0',
      '--color-bg': '#0f172a',
      '--color-card-bg': '#1e293b',
      '--color-text-primary': '#e2e8f0',
      '--color-text-secondary': '#94a3b8',
      '--color-border': 'rgba(148, 163, 184, 0.2)',
    },
  },
  default: {
    name: 'الافتراضي',
    settings: {
      accentColor: '#009688',
      titleColor: '#ffffff',
      subtitleColor: '#ffffff',
      '--color-bg': '#F0F4F8',
      '--color-card-bg': '#FFFFFF',
      '--color-text-primary': '#004d40',
      '--color-text-secondary': '#546E7A',
      '--color-border': 'rgba(0, 0, 0, 0.1)',
    },
  },
  light: {
    name: 'الوضع المضيء',
    settings: {
      accentColor: '#0ea5e9',
      titleColor: '#ffffff',
      subtitleColor: '#ffffff',
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
      titleColor: '#ffffff',
      subtitleColor: '#e2e8f0',
      '--color-bg': '#2d3748',
      '--color-card-bg': '#1a202c',
      '--color-text-primary': '#e2e8f0',
      '--color-text-secondary': '#a0aec0',
      '--color-border': 'rgba(244, 114, 182, 0.2)',
    },
  },
  oceanic: {
    name: 'المحيط',
    settings: {
      accentColor: '#38bdf8',
      '--color-bg': '#0c2438',
      '--color-card-bg': '#173a54',
      '--color-text-primary': '#e0f2fe',
      '--color-text-secondary': '#a5c9e2',
      '--color-border': 'rgba(165, 201, 226, 0.2)',
      titleColor: '#ffffff',
      subtitleColor: '#e0f2fe',
    },
  },
  crimson: {
    name: 'القرمزي',
    settings: {
      accentColor: '#dc2626',
      '--color-bg': '#1c1917',
      '--color-card-bg': '#292524',
      '--color-text-primary': '#f1f5f9',
      '--color-text-secondary': '#a8a29e',
      '--color-border': 'rgba(220, 38, 38, 0.2)',
      titleColor: '#ffffff',
      subtitleColor: '#f1f5f9',
    },
  },
    forest: {
    name: 'الغابة',
    settings: {
      accentColor: '#22c55e',
      '--color-bg': '#1a2e29',
      '--color-card-bg': '#23423a',
      '--color-text-primary': '#d1fae5',
      '--color-text-secondary': '#a3d9b8',
      '--color-border': 'rgba(34, 197, 94, 0.2)',
      titleColor: '#ffffff',
      subtitleColor: '#d1fae5',
    },
  },
};

const DEFAULT_DATA = {
    links: [
        { id: 1, title: 'نموذج تسجيل الأنشطة', url: 'https://forms.example.com/registration', icon: 'document', description: 'استخدم هذا النموذج لتسجيل اسمك في الأنشطة الطلابية المتاحة.', hidden: false },
        { id: 2, title: 'جدول الفعاليات', url: 'https://calendar.example.com/events', icon: 'calendar', description: 'اطلع على جدول ومواعيد جميع الفعاليات والأنشطة القادمة.', hidden: false },
    ],
    announcements: [
       {
            id: 1716901842838,
            title: "Stories of young professionals",
            category: 'male' as const,
            imageUrl: "https://i.imgur.com/gH5kI3w.jpeg",
            details: "This event aims to bridge the gap between academic study and the professional world",
            date: "2025-10-29T19:00:00.000Z",
            location: "Building 59 - Room 1001",
            registrationType: 'link' as const,
            registrationUrl: "https://example.com/register-1",
            clubName: "Deanship of Student Affairs"
        },
        {
            id: 1716815338102,
            title: "Check Out The Student Activities Events page",
            category: 'male' as const,
            imageUrl: "https://i.imgur.com/So0hWft.jpeg",
            details: "Explore Student Clubs Activates through a dedicated website",
            date: "2025-11-08T12:00:00.000Z",
            location: "Building 59 - Room 1001",
            registrationType: 'link' as const,
            registrationUrl: "https://example.com/register-2",
            clubName: "Deanship of Student Affairs"
        },
        {
            id: 1716815217992,
            title: "Annual Arts & Creativity Fair",
            category: 'female' as const,
            imageUrl: "https://i.imgur.com/e7qBEc3.jpeg",
            details: "We invite all creative female students to participate and showcase their artistic works in the annual exhibition.",
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Exhibition Hall - Activities Building",
            registrationType: 'link' as const,
            registrationUrl: "https://example.com/art-fair",
            clubName: "Arts Club"
        }
    ],
    themeConfig: {
        title: "إدارة النشاط الطلابي",
        subtitle: "بوابة الأندية الطلابية، مصدرك الشامل للإعلانات والروابط الهامة",
        titleSize: 'text-5xl md:text-6xl' as ThemeConfig['titleSize'],
        accentColor: '#2dd4bf',
        titleColor: '#FFFFFF',
        subtitleColor: '#E2E8F0',
        preset: 'dark',
        titleFont: 'Changa',
        headerIcon: 'link',
        announcementExpiryHours: 4,
        showExpiredAnnouncementsAdmin: false,
        newsletterHeaderImage: null,
        newsletterFooterImage: null,
    },
    adminPassword: 'admin'
};

const ITEMS_PER_PAGE = 5;

const App: React.FC = () => {
    // --- STATE & REFS ---
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
    const [adminPassword, setAdminPassword] = useState<string>('admin');
    const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
    const [isAnnouncementFormOpen, setIsAnnouncementFormOpen] = useState(false);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isDailyAnnouncementsModalOpen, setIsDailyAnnouncementsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
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
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'link' | 'announcement', id: number } | null>(null);


    // --- CALLBACKS & HELPER FUNCTIONS ---
    const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    }, []);

    const ensureThemeDefaults = (loadedConfig: Partial<ThemeConfig> | null): ThemeConfig => {
        const defaults = { ...DEFAULT_DATA.themeConfig };
        const finalConfig = {
            ...defaults,
            ...(loadedConfig || {}),
        };
        // Ensure newsletter images default to null if they are missing from loaded config
        finalConfig.newsletterHeaderImage = finalConfig.newsletterHeaderImage || null;
        finalConfig.newsletterFooterImage = finalConfig.newsletterFooterImage || null;
        return finalConfig;
    };
    
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
                const response = await fetch(DATA_SOURCE_URL);
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
                        setThemeConfig(ensureThemeDefaults(serverData.themeConfig));
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
                        setThemeConfig(ensureThemeDefaults(localData.themeConfig));
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
                const presetSettings = themePresets[themeConfig.preset]?.settings || themePresets.dark.settings;
                for (const [key, value] of Object.entries(presetSettings)) {
                    if (key !== 'accentColor' && key !== 'titleColor' && key !== 'subtitleColor') {
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
                            if (data && Array.isArray(data.links) && data.themeConfig && typeof data.themeConfig === 'object' && typeof data.adminPassword === 'string') {
                                setLinks(data.links);
                                setAnnouncements(data.announcements || []);
                                setThemeConfig(ensureThemeDefaults(data.themeConfig));
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
    
    // FIX: Defined closeLinkForm function to resolve the error.
    const closeLinkForm = () => {
        setEditingLink(null);
        setIsLinkFormOpen(false);
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
            const newLink: LinkItem = { id: Date.now(), title, url, icon, description, hidden: false };
            setLinks(prevLinks => [...prevLinks, newLink]);
            addToast('تمت إضافة الرابط بنجاح!');
        }
        closeLinkForm();
    };

    const closeAnnouncementForm = () => {
        setEditingAnnouncement(null);
        setIsAnnouncementFormOpen(false);
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

    const handleBulkSaveAnnouncements = (newAnnouncements: Omit<Announcement, 'id'>[]) => {
        const announcementsWithIds = newAnnouncements.map((ann, index) => ({
            ...ann,
            id: Date.now() + index, // Ensure unique IDs
        }));
        setAnnouncements(prev => [...announcementsWithIds, ...prev]);
        addToast('تم إضافة الإعلانات بنجاح!');
        setIsBulkModalOpen(false);
    };

    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setItemToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'link') {
            setLinks(prevLinks => prevLinks.filter(link => link.id !== itemToDelete.id));
            addToast('تم حذف الرابط بنجاح.', 'info');
        } else if (itemToDelete.type === 'announcement') {
            setAnnouncements(prev => prev.filter(ann => ann.id !== itemToDelete.id));
            addToast('تم حذف الإعلان بنجاح.', 'info');
        }

        handleCloseConfirmModal();
    };

    const handleDeleteLink = (id: number) => {
        setItemToDelete({ type: 'link', id });
        setIsConfirmModalOpen(true);
    };

    const handleDeleteAnnouncement = (id: number) => {
        setItemToDelete({ type: 'announcement', id });
        setIsConfirmModalOpen(true);
    };

    const handleEditLink = (link: LinkItem) => {
        setEditingLink(link);
        setIsLinkFormOpen(true);
    };

    const handleEditAnnouncement = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsAnnouncementFormOpen(true);
    };

    const openLinkForm = () => {
        setEditingLink(null);
        setIsLinkFormOpen(true);
    };

    const openAnnouncementForm = () => {
        setEditingAnnouncement(null);
        setIsAnnouncementFormOpen(true);
    };

    const handleReorderLinks = (reorderedLinks: LinkItem[]) => {
        setLinks(reorderedLinks);
    };
    
    const handleToggleVisibility = (id: number) => {
        setLinks(prevLinks =>
            prevLinks.map(link =>
                link.id === id ? { ...link, hidden: !link.hidden } : link
            )
        );
    };

    const handleVerifyPassword = (password: string) => {
        if (password === adminPassword) {
            setUserRole('admin');
            setIsPasswordModalOpen(false);
            addToast('تم تسجيل الدخول كمسؤول بنجاح.');
            return true;
        }
        return false;
    };

    const handleChangePassword = (current: string, newPass: string) => {
        if (current !== adminPassword) {
            return 'كلمة المرور الحالية غير صحيحة.';
        }
        setAdminPassword(newPass);
        addToast('تم تغيير كلمة المرور بنجاح.');
        setChangePasswordModalOpen(false);
        return null;
    };

    const handleRoleChange = (role: UserRole) => {
        if (role === 'admin' && userRole !== 'admin') {
            setIsPasswordModalOpen(true);
        } else {
            setUserRole(role);
        }
    };
    
    const handleSaveTheme = (newTheme: ThemeConfig) => {
        setThemeConfig(newTheme);
        setIsThemeModalOpen(false);
        addToast('تم تحديث المظهر بنجاح.');
    };
    

    // --- FILTERED DATA ---
    const filteredLinks = links.filter(link => {
        if (userRole === 'student' && link.hidden) return false;
        return (
            link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    const isToday = (someDate: Date) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() &&
               someDate.getMonth() === today.getMonth() &&
               someDate.getFullYear() === today.getFullYear();
    };

    const filteredAnnouncements = announcements
        .filter(ann => {
            if (themeConfig && themeConfig.announcementExpiryHours > 0) {
                const eventTime = new Date(ann.date).getTime();
                const expiryTime = eventTime + (themeConfig.announcementExpiryHours * 60 * 60 * 1000);
                const now = new Date().getTime();
                
                if (now >= expiryTime) { // It's expired
                    // Only show if I'm an admin and the toggle is on
                    return userRole === 'admin' && themeConfig.showExpiredAnnouncementsAdmin;
                }
            }
            // Not expired, or expiry is disabled. Show it.
            return true;
        })
        .filter(ann => ann.category === announcementCategory || ann.category === 'all')
        .filter(ann => {
             return (
                ann.title.toLowerCase().includes(announcementSearchQuery.toLowerCase()) ||
                (ann.clubName && ann.clubName.toLowerCase().includes(announcementSearchQuery.toLowerCase())) ||
                ann.location.toLowerCase().includes(announcementSearchQuery.toLowerCase())
            );
        })
        .filter(ann => {
            if (!showTodaysAnnouncements) return true;
            return isToday(new Date(ann.date));
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
    const announcementsCreatedToday = announcements.filter(ann => isToday(new Date(ann.id)));
    const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
    const paginatedAnnouncements = filteredAnnouncements.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // --- RENDER LOGIC ---
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">جاري تحميل البيانات...</div>;
    }
    
    if (!themeConfig) {
         return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">خطأ في تحميل إعدادات المظهر.</div>;
    }

    return (
        <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)] min-h-screen font-sans transition-colors duration-300">
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
            
            {viewingImage && (
                <ImageModal 
                    imageUrl={viewingImage} 
                    altText="عرض مكبر للإعلان"
                    onClose={() => setViewingImage(null)}
                />
            )}

            <main className="container mx-auto max-w-4xl px-4 py-8">
                <Header 
                    title={themeConfig.title}
                    subtitle={themeConfig.subtitle}
                    titleSize={themeConfig.titleSize}
                    headerIcon={themeConfig.headerIcon}
                    titleFont={themeConfig.titleFont}
                    titleColor={themeConfig.titleColor}
                    subtitleColor={themeConfig.subtitleColor}
                />
                <RoleSwitcher currentRole={userRole} onRoleChange={handleRoleChange} />
                
                {userRole === 'admin' && (
                    <div className="flex flex-col items-center justify-center gap-4 mb-8 print-hide">
                         <DataSourceStatus url={DATA_SOURCE_URL} isLoading={isRefreshing} error={fetchError} />
                         <div className="flex flex-wrap items-center justify-center gap-2">
                             <button
                                onClick={() => loadInitialData(true)}
                                disabled={isRefreshing}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-border)] hover:text-[var(--color-accent)]"
                            >
                                <RefreshIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                <span>{isRefreshing ? 'جاري التحديث...' : 'تحديث البيانات'}</span>
                            </button>
                            <button onClick={handleImport} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-border)] hover:text-[var(--color-accent)]">
                                <ImportIcon className="w-5 h-5" />
                                <span>استيراد</span>
                            </button>
                            <button onClick={handleExport} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-border)] hover:text-[var(--color-accent)]">
                                <ExportIcon className="w-5 h-5" />
                                <span>تصدير</span>
                            </button>
                             <button onClick={() => setChangePasswordModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-border)] hover:text-[var(--color-accent)]">
                                <KeyIcon className="w-5 h-5" />
                                <span>تغيير كلمة المرور</span>
                            </button>
                            <button onClick={() => setIsThemeModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-border)] hover:text-[var(--color-accent)]">
                                <ThemeIcon className="w-5 h-5" />
                                <span>تخصيص المظهر</span>
                            </button>
                            <button onClick={() => setIsStatisticsModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-border)] hover:text-[var(--color-accent)]">
                                <ChartBarIcon className="w-5 h-5" />
                                <span>إحصائيات</span>
                            </button>
                             <button onClick={() => setIsReportModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-border)] hover:text-[var(--color-accent)]">
                                <DocumentTextIcon className="w-5 h-5" />
                                <span>تقرير الأنشطة</span>
                            </button>
                         </div>
                    </div>
                )}
                
                <div className="flex items-center justify-center my-8">
                    <ViewSwitcher activeView={activeView} onSwitch={setActiveView} />
                </div>
                
                {activeView === 'announcements' && (
                    <div className="space-y-6">
                        {userRole === 'admin' && (
                            <div className="text-center mb-6 print-hide">
                                <button
                                    onClick={() => setIsDailyAnnouncementsModalOpen(true)}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-card-bg)] text-[var(--color-text-primary)] font-bold rounded-full hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg border border-[var(--color-border)]"
                                >
                                    <CalendarDaysIcon className="w-6 h-6" />
                                    <span>إعلانات اليوم</span>
                                </button>
                            </div>
                        )}
                        <AnnouncementFilters 
                            category={announcementCategory}
                            onCategoryChange={setAnnouncementCategory}
                            searchQuery={announcementSearchQuery}
                            onSearchChange={setAnnouncementSearchQuery}
                            showTodays={showTodaysAnnouncements}
                            onShowTodaysChange={setShowTodaysAnnouncements}
                        />
                        {userRole === 'admin' && (
                            <div className="flex items-center justify-center gap-4 print-hide">
                                <button
                                    onClick={openAnnouncementForm}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-bold rounded-full hover:brightness-110 transition-transform hover:scale-105 shadow-lg"
                                >
                                    <PlusIcon className="w-6 h-6" />
                                    <span>إضافة إعلان جديد</span>
                                </button>
                                <button
                                    onClick={() => setIsBulkModalOpen(true)}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold rounded-full hover:bg-[var(--color-border)] hover:text-[var(--color-accent)] transition-transform hover:scale-105 shadow-lg"
                                    title="إضافة إعلانات متعددة"
                                >
                                    <DocumentPlusIcon className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                        <AnnouncementList
                            announcements={paginatedAnnouncements}
                            userRole={userRole}
                            onDelete={handleDeleteAnnouncement}
                            onEdit={handleEditAnnouncement}
                            onImageClick={(url) => setViewingImage(url)}
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

                {activeView === 'links' && (
                    <div className="space-y-6">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="ابحث عن رابط..." />
                        {userRole === 'admin' && (
                            <div className="text-center print-hide">
                                <button
                                    onClick={openLinkForm}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-bold rounded-full hover:brightness-110 transition-transform hover:scale-105 shadow-lg"
                                >
                                    <PlusIcon className="w-6 h-6" />
                                    <span>إضافة رابط جديد</span>
                                </button>
                            </div>
                        )}
                        <LinkList
                            links={filteredLinks}
                            onDelete={handleDeleteLink}
                            onEdit={handleEditLink}
                            onReorder={handleReorderLinks}
                            onToggleVisibility={handleToggleVisibility}
                            userRole={userRole}
                            searchQuery={searchQuery}
                        />
                    </div>
                )}

                {/* --- Modals --- */}
                {isLinkFormOpen && (
                    <Modal onClose={closeLinkForm} size="2xl">
                        <AddLinkForm onSave={handleSaveLink} onClose={closeLinkForm} existingLink={editingLink} />
                    </Modal>
                )}
                {isAnnouncementFormOpen && (
                    <Modal onClose={closeAnnouncementForm} size="4xl">
                        <AnnouncementForm onSave={handleSaveAnnouncement} onClose={closeAnnouncementForm} existingAnnouncement={editingAnnouncement} />
                    </Modal>
                )}
                {isBulkModalOpen && (
                    <BulkAnnouncementModal onClose={() => setIsBulkModalOpen(false)} onSave={handleBulkSaveAnnouncements} />
                )}
                {isPasswordModalOpen && (
                    <PasswordModal onClose={() => setIsPasswordModalOpen(false)} onVerify={handleVerifyPassword} />
                )}
                {isChangePasswordModalOpen && (
                    <ChangePasswordModal onClose={() => setChangePasswordModalOpen(false)} onChangePassword={handleChangePassword} />
                )}
                {isThemeModalOpen && themeConfig && (
                    <ThemeModal onClose={() => setIsThemeModalOpen(false)} onSave={handleSaveTheme} currentTheme={themeConfig} />
                )}
                {isStatisticsModalOpen && (
                    <StatisticsModal announcements={announcements} onClose={() => setIsStatisticsModalOpen(false)} />
                )}
                {isReportModalOpen && (
                    <ReportModal announcements={announcements} onClose={() => setIsReportModalOpen(false)} />
                )}
                {isDailyAnnouncementsModalOpen && themeConfig && (
                    <DailyAnnouncementsModal 
                        announcements={announcementsCreatedToday} 
                        onClose={() => setIsDailyAnnouncementsModalOpen(false)}
                        headerImage={themeConfig.newsletterHeaderImage}
                        footerImage={themeConfig.newsletterFooterImage}
                        onHeaderImageChange={(image) => setThemeConfig(prev => prev ? { ...prev, newsletterHeaderImage: image } : null)}
                        onFooterImageChange={(image) => setThemeConfig(prev => prev ? { ...prev, newsletterFooterImage: image } : null)}
                    />
                )}
                {isConfirmModalOpen && itemToDelete && (
                    <ConfirmationModal
                        onClose={handleCloseConfirmModal}
                        onConfirm={handleConfirmDelete}
                        title="تأكيد الحذف"
                        message={`هل أنت متأكد أنك تريد حذف هذا ${itemToDelete.type === 'link' ? 'الرابط' : 'الإعلان'}؟ لا يمكن التراجع عن هذا الإجراء.`}
                    />
                )}
            </main>
        </div>
    );
};

export default App;

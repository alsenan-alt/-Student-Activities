import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { GoogleDriveIcon } from './components/icons/GoogleDriveIcon';

// Fix: Add declarations for gapi and google on the window object to resolve TypeScript errors.
declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

// --- Google Drive API Configuration ---
// هام: يجب استبدال هذه القيم بالقيم الحقيقية من Google Cloud Console
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_API_KEY = process.env.API_KEY || 'YOUR_GOOGLE_API_KEY'; 
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';
const SYNC_FILE_NAME = 'student-activity-data.json';
// ---

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

    const [gapiReady, setGapiReady] = useState(false);
    const [gisReady, setGisReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
    const [userProfile, setUserProfile] = useState<{ name: string; email: string; } | null>(null);
    const fileIdRef = useRef<string | null>(null);
    const tokenClientRef = useRef<any>(null);
    // Fix: Changed NodeJS.Timeout to number, which is the correct return type for setTimeout in a browser environment.
    const debounceTimeoutRef = useRef<number | null>(null);
    const isSyncEnabled = gapiReady && gisReady;
    
    // --- CALLBACKS & HELPER FUNCTIONS ---

    const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    }, []);

    const saveDataToDrive = useCallback(() => {
        if (!isLoggedIn) return;

        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

        debounceTimeoutRef.current = window.setTimeout(async () => {
            setSyncStatus('syncing');
            const appData = { links, themeConfig, adminPassword };
            const boundary = '-------314159265358979323846';
            const delimiter = "\r\n--" + boundary + "\r\n";
            const close_delim = "\r\n--" + boundary + "--";

            const metadata = {
                'name': SYNC_FILE_NAME,
                'mimeType': 'application/json',
            };

            const multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(appData) +
                close_delim;
            
            try {
                const path = fileIdRef.current
                    ? `/upload/drive/v3/files/${fileIdRef.current}`
                    : '/upload/drive/v3/files';
                
                const method = fileIdRef.current ? 'PATCH' : 'POST';

                const params = fileIdRef.current 
                    ? { uploadType: 'multipart' }
                    : { uploadType: 'multipart', fields: 'id' };

                const request = window.gapi.client.request({
                    'path': path,
                    'method': method,
                    'params': params,
                    'headers': {
                        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
                    },
                    'body': multipartRequestBody
                });

                const response = await request;
                if (!fileIdRef.current) {
                    fileIdRef.current = response.result.id;
                }
                setSyncStatus('success');
            } catch (error) {
                console.error('Failed to save data to drive', error);
                addToast('فشلت المزامنة مع Google Drive.', 'error');
                setSyncStatus('error');
            }
        }, 1500);
    }, [isLoggedIn, links, themeConfig, adminPassword, addToast]);
    
    const loadDataFromDrive = useCallback(async () => {
        setSyncStatus('syncing');
        try {
            const response = await window.gapi.client.drive.files.list({
                spaces: 'appDataFolder',
                fields: 'files(id, name)',
                q: `name='${SYNC_FILE_NAME}'`,
            });

            if (response.result.files.length > 0) {
                fileIdRef.current = response.result.files[0].id;
                const fileResponse = await window.gapi.client.drive.files.get({
                    fileId: fileIdRef.current,
                    alt: 'media',
                });
                
                const data = fileResponse.result;
                if (data.links && data.themeConfig && data.adminPassword) {
                    setLinks(data.links);
                    setThemeConfig(data.themeConfig);
                    setAdminPassword(data.adminPassword);
                    addToast('تم استعادة البيانات من Google Drive بنجاح.');
                }
            } else {
                addToast('لا يوجد ملف مزامنة. سيتم إنشاء واحد جديد.');
                saveDataToDrive();
            }
            setSyncStatus('success');
        } catch (error) {
            console.error('Failed to load data from drive', error);
            addToast('فشل تحميل البيانات من Google Drive.', 'error');
            setSyncStatus('error');
        }
    }, [addToast, saveDataToDrive]);

    const loadUserProfile = useCallback(async () => {
        try {
            const response = await window.gapi.client.request({
                path: 'https://www.googleapis.com/oauth2/v2/userinfo',
            });
            setUserProfile({
                name: response.result.name,
                email: response.result.email,
            });
        } catch (error) {
            console.error('Failed to load user profile', error);
        }
    }, []);

    // --- EFFECTS ---

    useEffect(() => {
        const checkGapi = setInterval(() => {
            if (window.gapi) {
                setGapiReady(true);
                clearInterval(checkGapi);
            }
        }, 100);
        const checkGis = setInterval(() => {
            if (window.google) {
                setGisReady(true);
                clearInterval(checkGis);
            }
        }, 100);

        return () => {
            clearInterval(checkGapi);
            clearInterval(checkGis);
        };
    }, []);

    useEffect(() => {
        if (gapiReady) {
            window.gapi.load('client', async () => {
                await window.gapi.client.init({
                    apiKey: GOOGLE_API_KEY,
                    discoveryDocs: DISCOVERY_DOCS,
                });
            });
        }
    }, [gapiReady]);

    useEffect(() => {
        if (gisReady) {
            tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: SCOPES,
                callback: (tokenResponse: any) => {
                    if (tokenResponse.error) {
                        addToast(`خطأ في المصادقة: ${tokenResponse.error}`, 'error');
                        return;
                    }
                    window.gapi.client.setToken(tokenResponse);
                    setIsLoggedIn(true);
                    addToast('تم الربط مع Google Drive بنجاح.');
                    loadUserProfile();
                    loadDataFromDrive();
                },
            });
        }
    }, [gisReady, addToast, loadUserProfile, loadDataFromDrive]);

    useEffect(() => {
        try {
            localStorage.setItem('studentActivityLinks', JSON.stringify(links));
            localStorage.setItem('studentActivityTheme', JSON.stringify(themeConfig));
            localStorage.setItem('studentActivityPassword', adminPassword);
            if (isLoggedIn) {
                saveDataToDrive();
            }
        } catch (error) {
            console.error("Failed to save to localStorage", error);
        }
    }, [links, themeConfig, adminPassword, isLoggedIn, saveDataToDrive]);
    
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
    
    const handleAuthClick = () => {
        if (GOOGLE_CLIENT_ID.startsWith('YOUR_')) {
            addToast('يرجى تكوين Google Client ID أولاً.', 'error');
            return;
        }
        tokenClientRef.current?.requestAccessToken({ prompt: '' });
    };

    const handleSignoutClick = () => {
        const token = window.gapi.client.getToken();
        if (token) {
            window.google.accounts.oauth2.revoke(token.access_token, () => {});
            window.gapi.client.setToken(null);
        }
        setIsLoggedIn(false);
        setUserProfile(null);
        fileIdRef.current = null;
        setSyncStatus('idle');
        addToast('تم تسجيل الخروج من Google Drive.');
    };
    
    // --- RENDER LOGIC ---

    const filteredLinks = links.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getSyncStatusMessage = () => {
        switch (syncStatus) {
            case 'syncing': return 'جاري المزامنة...';
            case 'success': return 'تمت المزامنة بنجاح';
            case 'error': return 'فشلت المزامنة';
            default: return userProfile ? `متصل كـ ${userProfile.email}` : 'غير متصل';
        }
    };

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
                    </div>

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
                                <h3 className="font-bold text-lg mb-2 text-[var(--color-text-primary)]">المزامنة مع Google Drive</h3>
                                {!isSyncEnabled ? (
                                    <p className="text-sm text-[var(--color-text-secondary)]">جاري تحميل أداة المزامنة...</p>
                                ) : !isLoggedIn ? (
                                    <>
                                        <p className="text-sm text-[var(--color-text-secondary)] mb-4">احفظ إعداداتك وبياناتك تلقائياً عبر الأجهزة.</p>
                                        <button 
                                            onClick={handleAuthClick}
                                            className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 bg-white text-gray-700 font-semibold rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-bg)] focus:ring-blue-500 shadow-md"
                                        >
                                            <GoogleDriveIcon className="w-5 h-5" />
                                            <span>الربط مع Google Drive</span>
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="text-sm text-[var(--color-text-secondary)]">{getSyncStatusMessage()}</p>
                                        <button 
                                            onClick={handleSignoutClick}
                                            className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors underline"
                                        >
                                            تسجيل الخروج
                                        </button>
                                    </div>
                                )}
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
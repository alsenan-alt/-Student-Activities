
import React, { useRef, useState, useMemo } from 'react';
import type { Announcement } from '../types';
import Modal from './Modal';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { XIcon } from './icons/XIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

// This lets TypeScript know that html2canvas will be available globally from the script tag.
declare const html2canvas: any;

const NewsletterAnnouncementItem: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    const eventDate = new Date(announcement.date);
    const formattedDate = eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const displayImageUrl = announcement.imageDataUrl || announcement.imageUrl;

    return (
        <div className="flex flex-col sm:flex-row gap-6 mb-8 items-start text-gray-800">
            {/* Image Section - Increased width on larger screens for better clarity */}
            <div className="w-full sm:w-64 flex-shrink-0">
                 <img
                    src={displayImageUrl}
                    alt={announcement.title}
                    className="w-full aspect-[16/9] object-cover rounded-lg shadow-md"
                    crossOrigin={announcement.imageDataUrl ? undefined : "anonymous"}
                 />
            </div>

            {/* Details Section */}
            <div className="flex-1">
                <h3 className="font-bold text-lg text-[#006A60] mb-1" style={{fontFamily: "'Tajawal', sans-serif"}}>{announcement.title}</h3>
                <p className="text-gray-600 text-sm">{announcement.details || 'Explore Student Clubs Activates through a dedicated website.'}</p>
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-gray-500" />
                        <span>{formattedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <LocationMarkerIcon className="w-5 h-5 text-gray-500" />
                        <span>{announcement.location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface DailyAnnouncementsModalProps {
  announcements: Announcement[];
  onClose: () => void;
  headerImage: string | null;
  footerImage: string | null;
  onHeaderImageChange: (image: string | null) => void;
  onFooterImageChange: (image: string | null) => void;
}

const withTimeout = <T,>(promise: Promise<T>, ms: number, timeoutMessage = 'Operation timed out'): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(timeoutMessage));
        }, ms);

        promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    });
};


const DailyAnnouncementsModal: React.FC<DailyAnnouncementsModalProps> = ({ announcements, onClose, headerImage, footerImage, onHeaderImageChange, onFooterImageChange }) => {
    const printableRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [viewMode, setViewMode] = useState<'select' | 'preview'>('select');
    
    // Sort by date (newest events first for selection)
    const sortedAllAnnouncements = useMemo(() => {
        return [...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [announcements]);

    // Initialize selection with announcements created today
    const [selectedIds, setSelectedIds] = useState<number[]>(() => {
        const today = new Date();
        return announcements.filter(ann => {
             const createdDate = new Date(ann.id); // Assuming ID is timestamp
             return createdDate.getDate() === today.getDate() &&
                    createdDate.getMonth() === today.getMonth() &&
                    createdDate.getFullYear() === today.getFullYear();
        }).map(a => a.id);
    });

    // Filter announcements for the preview based on selection
    const selectedAnnouncements = useMemo(() => {
        return announcements
            .filter(a => selectedIds.includes(a.id))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by event date ascending for the newsletter
    }, [announcements, selectedIds]);


    const handleToggleSelection = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === announcements.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(announcements.map(a => a.id));
        }
    };

    const handleImageUpload = (
      e: React.ChangeEvent<HTMLInputElement>,
      onImageReady: (imageDataUrl: string | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const tempImageUrl = loadEvent.target?.result as string;

                const image = new Image();
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1080; // Standard width for newsletter headers
                    
                    let width = image.width;
                    let height = image.height;

                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(image, 0, 0, width, height);
                        const resizedImageDataUrl = canvas.toDataURL(file.type, 0.92);
                        onImageReady(resizedImageDataUrl);
                    }
                };
                image.src = tempImageUrl;
            };
            reader.readAsDataURL(file);
        }
        // Reset file input to allow re-uploading the same file
        e.target.value = '';
    };


    const waitForImagesToLoad = (element: HTMLElement): Promise<void[]> => {
        const images = Array.from(element.querySelectorAll('img'));
        const promises = images.map(img => {
            return new Promise<void>((resolve) => {
                if (img.complete && img.naturalHeight !== 0) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.warn(`Could not load image, it will be blank in the capture: ${img.src}`);
                        resolve();
                    };
                }
            });
        });
        return Promise.all(promises);
    };

    const captureElement = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
        // 1. Clone the element to avoid altering the visible UI
        const clone = element.cloneNode(true) as HTMLElement;
    
        // 2. Prepend a CORS proxy to all external image URLs in the clone
        const images = Array.from(clone.querySelectorAll('img'));
        const proxyUrl = 'https://corsproxy.io/?';
    
        images.forEach(img => {
            const originalSrc = img.getAttribute('src'); // Use getAttribute to be safe
            // Only proxy external http(s) images. Don't proxy data URIs or relative paths.
            if (originalSrc && originalSrc.startsWith('http')) {
                // html2canvas requires the crossOrigin attribute to be set for CORS requests
                img.crossOrigin = 'anonymous';
                img.src = `${proxyUrl}${encodeURIComponent(originalSrc)}`;
            }
        });
    
        // 3. Append the clone to the body but keep it off-screen
        clone.style.position = 'absolute';
        clone.style.top = '-9999px';
        clone.style.left = '-9999px';
        // Ensure the clone has defined dimensions for html2canvas
        clone.style.width = `${element.offsetWidth}px`;
        clone.style.height = `${element.offsetHeight}px`;
        
        document.body.appendChild(clone);
    
        try {
            // 4. Wait for all (now proxied) images in the clone to load
            await waitForImagesToLoad(clone);
            // Add a small delay for the browser to render the final layout of the clone
            await new Promise(resolve => setTimeout(resolve, 300));
    
            // 5. Run html2canvas on the prepared clone
            const canvasPromise = html2canvas(clone, {
                useCORS: true,
                scale: 2,
                backgroundColor: '#ffffff',
            });
    
            const canvas = await withTimeout(
                canvasPromise,
                15000,
                'Image generation timed out. This may be due to network issues with the image proxy.'
            );
            return canvas as HTMLCanvasElement;
        } finally {
            // 6. Clean up: always remove the clone from the DOM
            document.body.removeChild(clone);
        }
    };


    const handleDownloadImage = async () => {
        const element = printableRef.current;
        if (!element || typeof html2canvas === 'undefined') {
            alert('لا يمكن تحميل الصورة حالياً.');
            return;
        }

        setIsDownloading(true);
        try {
            const canvas = await captureElement(element);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `daily-announcements-${new Date().toISOString().split('T')[0]}.jpeg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Oops, something went wrong during image generation!", error);
            alert(`حدث خطأ أثناء إنشاء الصورة: ${(error as Error).message}. قد تكون إحدى الصور الخارجية غير متاحة أو تم حظرها بواسطة الشبكة.`);
        } finally {
            setIsDownloading(false);
        }
    };
    
    const ImageUploader: React.FC<{
      label: string;
      image: string | null;
      onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onRemove: () => void;
    }> = ({ label, image, onUpload, onRemove }) => (
        <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)]">
            <label className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2 block">{label}</label>
            {image ? (
                <div className="relative group">
                    <img src={image} alt={`${label} preview`} className="w-full h-20 object-contain rounded bg-black/10"/>
                    <button onClick={onRemove} title="إزالة الصورة" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
            ) : (
                 <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={onUpload}
                    className="w-full text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-accent)] file:text-white hover:file:bg-opacity-90 cursor-pointer"
                />
            )}
        </div>
    );

    // --- SELECTION VIEW ---
    if (viewMode === 'select') {
        return (
            <Modal onClose={onClose} size="2xl">
                <div className="flex flex-col max-h-[85vh]">
                    <div className="flex-shrink-0 p-4 border-b border-[var(--color-border)]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[var(--color-accent)]">اختيار الإعلانات</h2>
                            <button onClick={onClose} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                                <XIcon className="w-6 h-6"/>
                            </button>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                            حدد الإعلانات التي تريد تضمينها في النشرة اليومية. الافتراضي هو الإعلانات التي تم إنشاؤها اليوم.
                        </p>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                                تم اختيار {selectedIds.length} إعلان
                            </span>
                            <button 
                                onClick={handleSelectAll}
                                className="text-sm text-[var(--color-accent)] hover:underline"
                            >
                                {selectedIds.length === announcements.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {sortedAllAnnouncements.map(ann => {
                            const isSelected = selectedIds.includes(ann.id);
                            return (
                                <div 
                                    key={ann.id}
                                    onClick={() => handleToggleSelection(ann.id)}
                                    className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${
                                        isSelected 
                                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' 
                                        : 'border-[var(--color-border)] hover:bg-[var(--color-card-bg)]'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                        isSelected 
                                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]' 
                                        : 'border-[var(--color-text-secondary)]'
                                    }`}>
                                        {isSelected && <CheckCircleIcon className="w-4 h-4 text-white" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-semibold text-sm truncate ${isSelected ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                                            {ann.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mt-1">
                                            <span>📅 {new Date(ann.date).toLocaleDateString('ar-EG')}</span>
                                            <span>📍 {ann.location}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex-shrink-0 p-4 border-t border-[var(--color-border)] flex justify-end gap-3">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button 
                            onClick={() => setViewMode('preview')}
                            disabled={selectedIds.length === 0}
                            className="px-6 py-2 bg-[var(--color-accent)] text-white font-semibold rounded-md hover:brightness-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <span>التالي: معاينة النشرة</span>
                            <ArrowRightIcon className="w-5 h-5 rotate-180" />
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    // --- PREVIEW VIEW ---
    return (
        <Modal onClose={onClose} size="4xl">
             <div className="flex flex-col max-h-[85vh] relative">
                {/* --- Control Panel --- */}
                 <div className="flex-shrink-0 p-4 border-b border-[var(--color-border)] print-hide">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                             <button 
                                onClick={() => setViewMode('select')}
                                className="p-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                                title="العودة للاختيار"
                             >
                                <ArrowRightIcon className="w-5 h-5" />
                             </button>
                             <h2 className="text-xl font-bold text-[var(--color-accent)]">معاينة النشرة</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"><XIcon className="w-6 h-6"/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <ImageUploader label="صورة الترويسة (Header)" image={headerImage} onUpload={(e) => handleImageUpload(e, onHeaderImageChange)} onRemove={() => onHeaderImageChange(null)} />
                        <ImageUploader label="صورة التذييل (Footer)" image={footerImage} onUpload={(e) => handleImageUpload(e, onFooterImageChange)} onRemove={() => onFooterImageChange(null)} />
                    </div>
                     <div className="text-center">
                        <button
                            onClick={handleDownloadImage}
                            disabled={isDownloading || selectedAnnouncements.length === 0}
                            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-full transition-all bg-[var(--color-accent)] text-white hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="تحميل النشرة كملف صورة"
                        >
                             {isDownloading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                             ) : (
                                <DownloadIcon className="h-5 w-5" />
                             )}
                            <span>{isDownloading ? 'جاري التحميل...' : 'تحميل كصورة'}</span>
                        </button>
                    </div>
                 </div>
                 
                {/* --- Printable/Scrollable Area --- */}
                <div className="flex-1 overflow-y-auto bg-white rounded-b-lg">
                    <div ref={printableRef} className="flex flex-col h-full">
                        {headerImage && (
                            <img
                                src={headerImage}
                                alt="Newsletter Header"
                                className="w-full block flex-shrink-0"
                                crossOrigin="anonymous"
                            />
                        )}
                        <div className="p-6 sm:p-10 flex-grow">
                            {selectedAnnouncements.length > 0 ? (
                                <div>
                                    {selectedAnnouncements.map((ann) => (
                                        <NewsletterAnnouncementItem key={ann.id} announcement={ann} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-gray-500 flex flex-col items-center justify-center h-full">
                                    <CalendarDaysIcon className="w-16 h-16 mx-auto opacity-50" />
                                    <p className="mt-4 text-lg">لم يتم تحديد أي إعلانات.</p>
                                </div>
                            )}
                        </div>
                        {footerImage && (
                            <img
                                src={footerImage}
                                alt="Newsletter Footer"
                                className="w-full block flex-shrink-0 mt-auto"
                                crossOrigin="anonymous"
                            />
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DailyAnnouncementsModal;

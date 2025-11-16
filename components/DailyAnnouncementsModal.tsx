import React, { useRef, useState } from 'react';
import type { Announcement } from '../types';
import Modal from './Modal';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { XIcon } from './icons/XIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { TrashIcon } from './icons/TrashIcon';

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
    
    const sortedAnnouncements = [...announcements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
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
        await waitForImagesToLoad(element);
        await new Promise(resolve => setTimeout(resolve, 200));

        const parentContainer = element.parentElement as HTMLElement;
        const originalParentMaxHeight = parentContainer.style.maxHeight;
        const originalElementOverflow = element.style.overflowY;

        parentContainer.style.maxHeight = 'none';
        element.style.overflowY = 'visible';

        try {
            const canvasPromise = html2canvas(element, {
                useCORS: true,
                scale: 2,
                backgroundColor: '#ffffff',
            });

            const canvas = await withTimeout(
                canvasPromise,
                15000,
                'Image generation timed out. This may be due to complex content or network issues.'
            );
            return canvas as HTMLCanvasElement;
        } finally {
            parentContainer.style.maxHeight = originalParentMaxHeight;
            element.style.overflowY = originalElementOverflow;
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
            alert(`حدث خطأ أثناء إنشاء الصورة: ${(error as Error).message}. قد تكون إحدى الصور غير متاحة، أو تم حظرها.`);
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

    return (
        <Modal onClose={onClose} size="4xl">
             <div className="flex flex-col max-h-[85vh] relative">
                {/* --- Control Panel --- */}
                 <div className="flex-shrink-0 p-4 border-b border-[var(--color-border)] print-hide">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-[var(--color-accent)]">إعداد نشرة إعلانات اليوم</h2>
                        <button onClick={onClose} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"><XIcon className="w-6 h-6"/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <ImageUploader label="صورة الترويسة (Header)" image={headerImage} onUpload={(e) => handleImageUpload(e, onHeaderImageChange)} onRemove={() => onHeaderImageChange(null)} />
                        <ImageUploader label="صورة التذييل (Footer)" image={footerImage} onUpload={(e) => handleImageUpload(e, onFooterImageChange)} onRemove={() => onFooterImageChange(null)} />
                    </div>
                     <div className="text-center">
                        <button
                            onClick={handleDownloadImage}
                            disabled={isDownloading || sortedAnnouncements.length === 0}
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
                            {sortedAnnouncements.length > 0 ? (
                                <div>
                                    {sortedAnnouncements.map((ann) => (
                                        <NewsletterAnnouncementItem key={ann.id} announcement={ann} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-gray-500 flex flex-col items-center justify-center h-full">
                                    <CalendarDaysIcon className="w-16 h-16 mx-auto opacity-50" />
                                    <p className="mt-4 text-lg">لم يتم إنشاء إعلانات جديدة اليوم.</p>
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

import React, { useRef, useState } from 'react';
import type { Announcement } from '../types';
import Modal from './Modal';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { XIcon } from './icons/XIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

// This lets TypeScript know that html2canvas will be available globally from the script tag.
declare const html2canvas: any;
declare const jspdf: any;

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


const DailyAnnouncementsModal: React.FC<DailyAnnouncementsModalProps> = ({ announcements, onClose }) => {
    const printableRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    
    const sortedAnnouncements = [...announcements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Helper function to wait for all images inside an element to load
    const waitForImagesToLoad = (element: HTMLElement): Promise<void[]> => {
        const images = Array.from(element.querySelectorAll('img'));
        const promises = images.map(img => {
            return new Promise<void>((resolve) => {
                if (img.complete && img.naturalHeight !== 0) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    // Resolve even on error to prevent the whole process from failing.
                    // html2canvas will render a blank space for the broken image.
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

        // Temporarily remove constraints to capture full content
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
            // Restore original styles
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
    
    const handleDownloadPdf = async () => {
        const element = printableRef.current;
        if (!element || typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
            alert('لا يمكن تحميل الملف حالياً.');
            return;
        }

        setIsDownloadingPdf(true);
        try {
            const canvas = await captureElement(element);
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const { jsPDF } = jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfPageWidth = pdf.internal.pageSize.getWidth();
            const pdfPageHeight = pdf.internal.pageSize.getHeight();
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            
            const imgHeightInPdf = pdfPageWidth / ratio;
            let heightLeft = imgHeightInPdf;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, pdfPageWidth, imgHeightInPdf);
            heightLeft -= pdfPageHeight;

            while (heightLeft > 0) {
              position -= pdfPageHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'JPEG', 0, position, pdfPageWidth, imgHeightInPdf);
              heightLeft -= pdfPageHeight;
            }

            pdf.save(`daily-announcements-${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error("Oops, something went wrong during PDF generation!", error);
            alert(`حدث خطأ أثناء إنشاء ملف PDF: ${(error as Error).message}`);
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    return (
        <Modal onClose={onClose} size="4xl">
             <div className="flex flex-col max-h-[85vh] relative">
                {/* --- Control Panel --- */}
                 <div className="absolute top-0 -right-2 z-20 flex flex-col items-center justify-end gap-2 p-2 print-hide">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                        title="إغلاق"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isDownloadingPdf || sortedAnnouncements.length === 0}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="تحميل النشرة كملف PDF"
                    >
                         {isDownloadingPdf ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         ) : (
                            <DocumentTextIcon className="h-5 w-5" />
                         )}
                        <span className="hidden sm:inline">{isDownloadingPdf ? 'جاري التحضير...' : 'تحميل كـ PDF'}</span>
                    </button>
                    <button
                        onClick={handleDownloadImage}
                        disabled={isDownloading || sortedAnnouncements.length === 0}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all bg-[var(--color-accent)] text-white hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="تحميل النشرة كملف صورة"
                    >
                         {isDownloading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         ) : (
                            <DownloadIcon className="h-5 w-5" />
                         )}
                        <span className="hidden sm:inline">{isDownloading ? 'جاري التحميل...' : 'تحميل كصورة'}</span>
                    </button>
                </div>
                 
                {/* --- Printable/Scrollable Area --- */}
                <div ref={printableRef} className="flex-1 overflow-y-auto bg-white rounded-lg p-6 sm:p-10">
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
            </div>
        </Modal>
    );
};

export default DailyAnnouncementsModal;
import React, { useState } from 'react';
import type { Announcement } from '../types';
import Modal from './Modal';
import { ShareIcon } from './icons/ShareIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { SocialXIcon } from './icons/SocialXIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { LinkIcon } from './icons/LinkIcon';

interface ShareModalProps {
  announcement: Announcement;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ announcement, onClose }) => {
    const [copyButtonText, setCopyButtonText] = useState('نسخ الرابط');
    const shareUrl = `${window.location.origin}${window.location.pathname}?view=announcements&id=${announcement.id}`;
    const shareText = `تحقق من هذا الإعلان: ${announcement.title}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setCopyButtonText('تم النسخ!');
                setTimeout(() => setCopyButtonText('نسخ الرابط'), 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                setCopyButtonText('فشل النسخ');
                 setTimeout(() => setCopyButtonText('نسخ الرابط'), 2000);
            });
    };
    
    const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;

    return (
        <Modal onClose={onClose} size="md">
            <div className="text-center">
                 <div className="inline-flex items-center justify-center bg-[var(--color-bg)] p-3 rounded-full mb-4">
                    <ShareIcon className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[var(--color-accent)]">مشاركة الإعلان</h2>
                <p className="text-[var(--color-text-secondary)] mb-6 truncate">"{announcement.title}"</p>
                
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse bg-[var(--color-bg)] p-2 rounded-lg border border-[var(--color-border)]">
                        <LinkIcon className="w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0 mx-2"/>
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="w-full bg-transparent text-sm text-[var(--color-text-secondary)] outline-none text-right"
                            onFocus={(e) => e.target.select()}
                        />
                        <button
                            onClick={handleCopyLink}
                            className="px-4 py-2 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-md hover:brightness-90 transition-all flex-shrink-0 w-28"
                        >
                            {copyButtonText}
                        </button>
                    </div>
                    <div className="flex justify-center items-center gap-4 pt-4">
                         <a href={xShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-4 py-2 font-semibold rounded-md bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors">
                            <SocialXIcon className="w-5 h-5" />
                            <span>X</span>
                        </a>
                         <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-4 py-2 font-semibold rounded-md bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
                            <WhatsAppIcon className="w-5 h-5" />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>

                 <div className="flex justify-center mt-8">
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-[var(--color-text-secondary)]/20 text-[var(--color-text-primary)] font-semibold rounded-md hover:bg-[var(--color-text-secondary)]/30 transition-colors"
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ShareModal;

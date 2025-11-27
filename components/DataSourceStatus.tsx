
import React, { useState } from 'react';
import { PencilIcon } from './icons/PencilIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface DataSourceStatusProps {
  url: string;
  isLoading: boolean;
  error: string | null;
  onUrlChange: (newUrl: string) => void;
}

const DataSourceStatus: React.FC<DataSourceStatusProps> = ({ url, isLoading, error, onUrlChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempUrl, setTempUrl] = useState(url);

    let statusIndicator;
    let statusText;
    let statusColor;

    if (isLoading) {
        statusIndicator = <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>;
        statusText = 'جاري المزامنة...';
        statusColor = 'text-gray-400';
    } else if (error) {
        statusIndicator = <span className="h-3 w-3 bg-red-500 rounded-full"></span>;
        statusText = 'فشل الاتصال';
        statusColor = 'text-red-400';
    } else {
        statusIndicator = <span className="h-3 w-3 bg-green-500 rounded-full"></span>;
        statusText = 'متصل ومُحدَّث';
        statusColor = 'text-green-400';
    }

    if (!url && !isLoading) {
        statusIndicator = <span className="h-3 w-3 bg-yellow-500 rounded-full"></span>;
        statusText = 'غير مُكوَّن';
        statusColor = 'text-yellow-400';
    }

    const handleSave = () => {
        onUrlChange(tempUrl);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempUrl(url);
        setIsEditing(false);
    };

    return (
        <div className="w-full max-w-xl p-4 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-sm mb-6 transition-all duration-300">
            <h3 className="font-bold text-lg mb-3 text-[var(--color-text-primary)] flex justify-between items-center">
                <span>حالة مصدر البيانات (JSON)</span>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] p-1 rounded-full hover:bg-[var(--color-border)] transition-colors"
                        title="تعديل الرابط"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                )}
            </h3>
            
            <div className="flex items-center gap-3 mb-2">
                {statusIndicator}
                <span className={`font-semibold ${statusColor}`}>{statusText}</span>
            </div>

            {isEditing ? (
                <div className="mt-3 animate-fade-in-up">
                    <label className="block text-xs text-[var(--color-text-secondary)] mb-1">رابط npoint.io الجديد:</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={tempUrl} 
                            onChange={(e) => setTempUrl(e.target.value)}
                            className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-1.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-accent)] outline-none"
                            placeholder="https://api.npoint.io/..."
                            dir="ltr"
                        />
                        <button onClick={handleSave} className="bg-green-600/20 text-green-500 p-1.5 rounded hover:bg-green-600/30">
                            <CheckCircleIcon className="w-5 h-5" />
                        </button>
                         <button onClick={handleCancel} className="bg-red-600/20 text-red-500 p-1.5 rounded hover:bg-red-600/30">
                            <XCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">
                        تنبيه: تغيير الرابط سيؤدي إلى جلب البيانات من المصدر الجديد عند التحديث القادم.
                    </p>
                </div>
            ) : (
                <p className="text-[var(--color-text-secondary)] text-xs break-all mb-2 flex items-center gap-2" dir="ltr">
                    <strong className="flex-shrink-0">URL:</strong> 
                    <span className="font-mono">{url || 'غير محدد'}</span>
                </p>
            )}

            {error && !isLoading && !isEditing && (
                 <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded-md mt-2">
                    <strong>تفاصيل الخطأ:</strong> {error}
                </div>
            )}
        </div>
    );
};

export default DataSourceStatus;

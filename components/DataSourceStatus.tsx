import React from 'react';

interface DataSourceStatusProps {
  url: string;
  isLoading: boolean;
  error: string | null;
}

const DataSourceStatus: React.FC<DataSourceStatusProps> = ({ url, isLoading, error }) => {
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

    return (
        <div className="w-full max-w-xl p-4 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-sm mb-6">
            <h3 className="font-bold text-lg mb-3 text-[var(--color-text-primary)]">حالة مصدر البيانات (Gist)</h3>
            <div className="flex items-center gap-3 mb-2">
                {statusIndicator}
                <span className={`font-semibold ${statusColor}`}>{statusText}</span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-xs break-all mb-2">
                <strong>الرابط:</strong> {url || 'غير محدد'}
            </p>
            {error && !isLoading && (
                 <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded-md">
                    <strong>تفاصيل الخطأ:</strong> {error}
                </div>
            )}
        </div>
    );
};

export default DataSourceStatus;

import React from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = React.useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);
    
    // Add pages around current page
    for (let i = -1; i <= 1; i++) {
        const page = currentPage + i;
        if (page > 1 && page < totalPages) {
            pages.add(page);
        }
    }
    
    // Ensure there are enough pages shown if near edges
    if (currentPage <= 3) {
      pages.add(2);
      pages.add(3);
    }

    if (currentPage >= totalPages - 2) {
      pages.add(totalPages - 1);
      pages.add(totalPages - 2);
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    const result: (number | string)[] = [];
    let lastPage: number | null = null;

    for (const page of sortedPages) {
      if (lastPage !== null && page > lastPage + 1) {
        result.push('...');
      }
      result.push(page);
      lastPage = page;
    }

    return result;
  }, [currentPage, totalPages]);


  return (
    <nav aria-label="Pagination" className="flex justify-center items-center gap-2 sm:gap-4 text-[var(--color-text-primary)]">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="الصفحة السابقة"
      >
        <ChevronRightIcon className="w-5 h-5" /> 
        <span className="hidden sm:inline text-sm">السابق</span>
      </button>

      <ul className="flex items-center gap-1 sm:gap-2">
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-2 sm:px-4 py-2 text-sm text-[var(--color-text-secondary)]">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`w-10 h-10 text-sm font-semibold rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-[var(--color-accent)] text-white shadow-md'
                    : 'bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-border)]'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="الصفحة التالية"
      >
        <span className="hidden sm:inline text-sm">التالي</span>
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default Pagination;

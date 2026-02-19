import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showLimitSelector?: boolean;
  limitOptions?: number[];
  showInfo?: boolean;
  className?: string;
  disabled?: boolean;
}

const Icons = {
  ChevronLeft: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  ChevronsLeft: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="11 18 5 12 11 6"></polyline>
      <polyline points="18 18 12 12 18 6"></polyline>
    </svg>
  ),
  ChevronsRight: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="13 18 19 12 13 6"></polyline>
      <polyline points="6 18 12 12 6 6"></polyline>
    </svg>
  ),
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
  showLimitSelector = false,
  limitOptions = [10, 20, 50, 100],
  showInfo = true,
  className = '',
  disabled = false,
}) => {
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, totalItems);

  const handlePageChange = (page: number) => {
    if (!disabled && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!disabled && onLimitChange) {
      onLimitChange(Number(e.target.value));
    }
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {showInfo && (
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{startIndex}</span> to{' '}
          <span className="font-medium text-foreground">{endIndex}</span> of{' '}
          <span className="font-medium text-foreground">{totalItems}</span> results
        </div>
      )}

      <div className="flex items-center gap-2">
        {showLimitSelector && onLimitChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="limit-select" className="text-sm text-muted-foreground">
              Show:
            </label>
            <select
              id="limit-select"
              value={limit}
              onChange={handleLimitChange}
              disabled={disabled}
              className="px-3 py-1.5 border border-input bg-background rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage === 1}
            className="p-2 rounded-lg border border-input text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="First page"
          >
            <Icons.ChevronsLeft />
          </button>

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            className="p-2 rounded-lg border border-input text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <Icons.ChevronLeft />
          </button>

          <div className="flex items-center gap-1">
            {renderPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-muted-foreground"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={disabled}
                  className={`px-4 py-2 rounded-lg border transition-colors ${isActive
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-input text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            className="p-2 rounded-lg border border-input text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <Icons.ChevronRight />
          </button>

          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            className="p-2 rounded-lg border border-input text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Last page"
          >
            <Icons.ChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

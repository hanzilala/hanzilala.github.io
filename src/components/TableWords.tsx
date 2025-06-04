import React, { useState } from 'react';

export interface WordData {
  id: string;
  word: string;
  meaning: string;
  pinyin: string;
}

export interface TableWordsProps {
  words: WordData[];
  isLoading?: boolean;
  hasMore?: boolean;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onLoadMore?: () => void;
  className?: string;
  showLoadMore?: boolean; // To choose between pagination or load more
}

export const TableWords: React.FC<TableWordsProps> = ({
  words,
  isLoading = false,
  hasMore = false,
  currentPage = 1,
  totalPages = 1,
  pageSize = 20,
  onPageChange,
  onLoadMore,
  className = '',
  showLoadMore = false,
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPaginationButton = (page: number, isActive: boolean = false) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      disabled={isActive}
      className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
        isActive
          ? 'bg-blue text-base font-medium'
          : 'text-subtext1 hover:text-text hover:bg-surface0'
      }`}
    >
      {page}
    </button>
  );

  const renderPagination = () => {
    if (showLoadMore || totalPages <= 1) return null;

    const pages = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Always show first page
      pages.push(renderPaginationButton(1, currentPage === 1));

      // Show ellipsis if current page is far from start
      if (currentPage > 4) {
        pages.push(
          <span key="ellipsis-start" className="px-2 text-subtext0">
            ...
          </span>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(renderPaginationButton(i, currentPage === i));
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 3) {
        pages.push(
          <span key="ellipsis-end" className="px-2 text-subtext0">
            ...
          </span>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(renderPaginationButton(totalPages, currentPage === totalPages));
      }
    } else {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderPaginationButton(i, currentPage === i));
      }
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm text-subtext1 hover:text-text disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          ← Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm text-subtext1 hover:text-text disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next →
        </button>
      </div>
    );
  };

  const renderLoadMore = () => {
    if (!showLoadMore || !hasMore) return null;

    return (
      <div className="flex justify-center mt-6">
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="px-6 py-3 bg-blue hover:bg-blue/90 text-base rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-base border-t-transparent"></div>
              Loading...
            </>
          ) : (
            'Load More'
          )}
        </button>
      </div>
    );
  };

  if (words.length === 0 && !isLoading) {
    return (
      <div className={`rounded-xl bg-mantle ${className}`}>
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="w-16 h-16 text-subtext0 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-subtext1 text-lg">No words found</p>
          <p className="text-subtext0 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="border-b-2 border-surface">
        <div className="grid grid-cols-12 gap-6 px-6 py-4">
          <div className="col-span-4 font-semibold text-text text-sm uppercase tracking-wide">Word</div>
          <div className="col-span-3 font-semibold text-text text-sm uppercase tracking-wide">Pinyin</div>
          <div className="col-span-5 font-semibold text-text text-sm uppercase tracking-wide">Meaning</div>
        </div>
      </div>

      {/* Table Body */}
      <div>
        {words.map((word, index) => (
          <div
            key={word.id}
            className={`grid grid-cols-12 gap-6 px-6 py-4 transition-colors duration-200 ${
              index % 2 === 0 ? 'bg-base' : 'bg-mantle'
            } ${hoveredRow === word.id ? 'bg-surface0' : ''}`}
            onMouseEnter={() => setHoveredRow(word.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div className="col-span-4">
              <span className="text-text font-medium text-lg">{word.word}</span>
            </div>
            <div className="col-span-3">
              <span className="text-lavender font-mono text-sm">{word.pinyin}</span>
            </div>
            <div className="col-span-5">
              <span className="text-subtext1">{word.meaning}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && words.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue border-t-transparent"></div>
          <span className="ml-3 text-subtext1">Loading words...</span>
        </div>
      )}

      {/* Pagination or Load More */}
      {words.length > 0 && (
        <div className="px-6 pb-6">
          {showLoadMore ? renderLoadMore() : renderPagination()}
        </div>
      )}

      {/* Results Info */}
      {words.length > 0 && !showLoadMore && (
        <div className="px-6 pb-4">
          <p className="text-sm text-subtext0 text-center">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, (currentPage - 1) * pageSize + words.length)} results
          </p>
        </div>
      )}
    </div>
  );
}; 

import React from 'react';

export interface NotebookItemData {
  id: string;
  name: string;
  description?: string;
  label?: string; // For HSK items and other static labels
}

export interface NotebookItemProps {
  notebook: NotebookItemData;
  onClick: (notebook: NotebookItemData) => void;
  variant?: 'default' | 'premium' | 'free';
  disabled?: boolean;
  className?: string;
}

export const NotebookItem: React.FC<NotebookItemProps> = ({
  notebook,
  onClick,
  variant = 'default',
  disabled = false,
  className = ''
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick(notebook);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return 'bg-yellow/10 border-yellow/20 hover:bg-yellow/20 hover:border-yellow/40';
      case 'free':
        return 'bg-green/10 border-green/20 hover:bg-green/20 hover:border-green/40';
      default:
        return 'bg-rosewater/10 border-rosewater/20 hover:bg-rosewater/20 hover:border-rosewater/40';
    }
  };

  const baseStyles = `
    w-full p-3 sm:p-4 rounded-lg transition-all duration-200 text-left group border
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${getVariantStyles()}
    ${className}
  `;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={baseStyles}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-text truncate">
            {notebook.label || notebook.name}
          </h3>
          {notebook.description && (
            <p className="text-sm text-subtext1 mt-1 line-clamp-2">
              {notebook.description}
            </p>
          )}
        </div>
        
        {!disabled && (
          <svg 
            className="w-4 h-4 text-subtext0 flex-shrink-0 ml-2 group-hover:text-text transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </button>
  );
}; 

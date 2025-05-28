import React, { useState } from 'react';

export interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-base rounded-lg border border-surface1 ${className}`}>
      <button
        onClick={toggleExpanded}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-surface0 transition-colors duration-200 rounded-t-lg"
      >
        <h4 className="text-base font-semibold text-mauve flex items-center">
          {title}
        </h4>
        <span 
          className={`text-mauve transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : 'rotate-0'
          }`}
        >
          ▶
        </span>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}; 

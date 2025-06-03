import React, { useState, useRef, useEffect } from 'react';

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
  const [height, setHeight] = useState<string | number>(defaultExpanded ? 'auto' : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        // Temporarily set to auto, then measure and set fixed height for animation
        const scrollHeight = contentRef.current.scrollHeight;
        setHeight(scrollHeight);
        // After animation, set to auto for natural content flow
        setTimeout(() => setHeight('auto'), 300);
      } else {
        // First set current height for smooth animation
        if (height === 'auto') {
          setHeight(contentRef.current.scrollHeight);
        }
        // Then animate to 0
        setTimeout(() => setHeight(0), 10);
      }
    }
  }, [isExpanded, children]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-base rounded-lg border border-surface1 overflow-hidden ${className}`}>
      <button
        onClick={toggleExpanded}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-surface0 transition-colors duration-200"
      >
        <h4 className="text-base font-semibold text-mauve flex items-center">
          {title}
        </h4>
        <span 
          className={`text-mauve transition-transform duration-300 ease-out ${
            isExpanded ? 'rotate-90' : 'rotate-0'
          }`}
        >
          ▶
        </span>
      </button>
      
      <div 
        ref={contentRef}
        className="transition-all duration-300 ease-out overflow-hidden"
        style={{ height: height }}
      >
        <div className={`px-4 pb-3 transition-opacity duration-300 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        }`}>
          {children}
        </div>
      </div>
    </div>
  );
}; 

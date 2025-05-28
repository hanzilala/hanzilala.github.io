import React from 'react';
import { useLayout, LayoutType } from './ThemeProvider';

const LayoutSwitcher: React.FC = () => {
  const { layout, setLayout } = useLayout();

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
  };

  return (
    <div className="flex items-center gap-1 bg-surface0 rounded-lg p-1">
      <button
        onClick={() => handleLayoutChange('default')}
        className={`px-3 py-1 rounded text-sm transition-colors ${
          layout === 'default'
            ? 'bg-blue text-base'
            : 'text-subtext1 hover:text-text hover:bg-surface1'
        }`}
        title="Default Layout (Horizontal)"
      >
        ⚏
      </button>
      <button
        onClick={() => handleLayoutChange('fullscreen')}
        className={`px-3 py-1 rounded text-sm transition-colors ${
          layout === 'fullscreen'
            ? 'bg-blue text-base'
            : 'text-subtext1 hover:text-text hover:bg-surface1'
        }`}
        title="Fullscreen Layout (Vertical)"
      >
        ⚍
      </button>
    </div>
  );
};

export default LayoutSwitcher; 

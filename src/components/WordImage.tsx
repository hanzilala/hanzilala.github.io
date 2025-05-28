import React, { useState } from 'react';

interface WordImageProps {
  imageUrl?: string;
  word: string;
  className?: string;
  fallbackUrl?: string;
}

export const WordImage: React.FC<WordImageProps> = ({ 
  imageUrl, 
  word, 
  className = "",
  fallbackUrl
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(imageUrl);

  const handleImageError = () => {
    if (currentUrl === imageUrl && fallbackUrl) {
      // Try fallback URL
      setCurrentUrl(fallbackUrl);
      setImageLoading(true);
    } else {
      setImageError(true);
      setImageLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (!currentUrl || imageError) {
    return (
      <div className={`bg-surface0 border border-surface1 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm text-subtext1">No image available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-surface0 border border-surface1 rounded-lg overflow-hidden ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface0">
          <div className="text-center">
            <div className="text-2xl mb-2">⏳</div>
            <div className="text-sm text-subtext1">Loading image...</div>
          </div>
        </div>
      )}
      <img
        src={currentUrl}
        alt={`Image for ${word}`}
        className="w-full h-full object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: imageLoading ? 'none' : 'block' }}
      />
    </div>
  );
}; 

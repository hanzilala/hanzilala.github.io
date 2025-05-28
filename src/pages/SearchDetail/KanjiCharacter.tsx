import React, { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { useTheme } from '../../components/ThemeProvider';

export interface KanjiCharacterProps {
  character: string;
  isAnimating: boolean;
  onAnimationStart: (char: string) => void;
  onAnimationEnd: () => void;
}

export const KanjiCharacter: React.FC<KanjiCharacterProps> = ({
  character
}) => {
  const writerRef = useRef<any>(null);
  const previewWriterRef = useRef<any>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const previewElementRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { theme } = useTheme();

  // Use theme-appropriate colors based on current theme
  const getThemeColors = () => {
    const colorPalettes = {
      latte: {
        strokeColor: '#4c4f69', // text
        outlineColor: '#9ca0b0', // surface2
        highlightColor: '#d20f39', // red
        drawingColor: '#1e66f5', // blue
      },
      mocha: {
        strokeColor: '#cdd6f4', // text
        outlineColor: '#585b70', // surface2
        highlightColor: '#f38ba8', // red
        drawingColor: '#89b4fa', // blue
      },
    };

    return colorPalettes[theme] || colorPalettes.latte;
  };

  useEffect(() => {
    if (elementRef.current) {
      // Clear previous content
      elementRef.current.innerHTML = '';
      try {
        const colors = getThemeColors();
        writerRef.current = HanziWriter.create(elementRef.current, character, {
          width: 120,
          height: 120,
          padding: 5,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 150,
          strokeColor: colors.strokeColor,
          outlineColor: colors.outlineColor,
          highlightColor: colors.highlightColor,
          drawingColor: colors.drawingColor,
          showCharacter: true,
          showOutline: true,
        });
        writerRef.current.loopCharacterAnimation();
      } catch (err) {
        console.warn(`Failed to create writer for character: ${character}`, err);
      }
    }

    return () => {
      writerRef.current?.destroy?.();
      writerRef.current = null;
      previewWriterRef.current?.destroy?.();
      previewWriterRef.current = null;
    };
  }, [character, theme, elementRef]);

  useEffect(() => {
    if (showPreview && previewElementRef.current) {

    }
  }, [showPreview, previewElementRef.current]);

  const handleClick = () => {
    if (showPreview) {
      previewWriterRef.current?.destroy?.();
      previewWriterRef.current = null;
      setShowPreview(false);
    } else {
      setShowPreview(true);
      setTimeout(() => {
        if (previewElementRef.current) {
          const colors = getThemeColors();
          previewWriterRef.current = HanziWriter.create(previewElementRef.current, character, {
            width: 300,
            height: 300,
            padding: 20,
            strokeAnimationSpeed: 0.8,
            delayBetweenStrokes: 200,
            strokeColor: colors.strokeColor,
            outlineColor: colors.outlineColor,
            highlightColor: colors.highlightColor,
            drawingColor: colors.drawingColor,
            showCharacter: true,
            showOutline: true,
          });
          previewWriterRef.current.loopCharacterAnimation();
        }
      }, 100);
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    // Close preview when clicking outside
    if (e.target === e.currentTarget) {
      previewWriterRef.current?.destroy?.();
      previewWriterRef.current = null;
      setShowPreview(false);
    }
  };

  return (
    <>
      <div
        className="text-center w-40 relative"
        onClick={handleClick}
      >
        <div className="bg-base p-3 rounded-lg mb-1 border border-surface2 hover:border-overlay0 transition-colors cursor-pointer">
          <div className="text-xl font-bold text-pink mb-2">{character}</div>
          <div
            ref={elementRef}
            className="mx-auto"
            style={{ width: '120px', height: '120px' }}
          ></div>
        </div>
      </div>

      {/* Click Preview */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClickOutside}
        >
          <div className="bg-base border-2 border-blue rounded-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl font-bold text-pink">
                {character}
              </div>
              <button
                onClick={() => {
                  previewWriterRef.current?.destroy?.();
                  setShowPreview(false);
                }}
                className="text-text hover:text-red transition-colors text-xl"
              >
                ✕
              </button>
            </div>
            <div
              ref={previewElementRef}
              className="mx-auto"
              style={{ width: '300px', height: '300px' }}
            ></div>
          </div>
        </div>
      )}
    </>
  );
}; 

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
  character,
  isAnimating,
  onAnimationStart,
  onAnimationEnd
}) => {
  const writerRef = useRef<any>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isLocalAnimating, setIsLocalAnimating] = useState(false);
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
      if (writerRef.current && writerRef.current.destroy) {
        writerRef.current.destroy();
      }
    };
  }, [character, theme, elementRef]);

  const handleAnimate = () => {
    const writer = writerRef.current;
    if (writer && !isAnimating && !isLocalAnimating) {
      setIsLocalAnimating(true);
      onAnimationStart(character);

      writer.animateCharacter({
        onComplete: () => {
          setIsLocalAnimating(false);
          onAnimationEnd();
        }
      });
    }
  };

  return (
    <div className="text-center w-40">
      <div className="bg-base p-3 rounded-lg mb-1 border border-surface2 hover:border-overlay0 transition-colors">
        <div className="text-xl font-bold text-pink mb-2">{character}</div>
        <div
          ref={elementRef}
          className="mx-auto"
          style={{ width: '120px', height: '120px' }}
        ></div>
      </div>
      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        <button
          onClick={handleAnimate}
          disabled={isAnimating || isLocalAnimating}
          className="px-2 py-1 bg-blue text-base rounded text-xs hover:bg-sapphire disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLocalAnimating ? '⏳' : '▶️'}
        </button>
      </div>
    </div>
  );
}; 

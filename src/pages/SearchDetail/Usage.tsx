import React, { useState, useEffect } from 'react';
import { HanziiWordDetails } from '../../api/hanzii';
import { useWordItems, useLanguage } from '../../components/ThemeProvider';
import { getPartOfSpeechLabel } from '../../config/partOfSpeechMapping';
import { WordImage } from '../../components/WordImage';
import { hanziService } from '../../services/hanziService';
import { CollapsibleSection } from '../../components/CollapsibleSection';

export interface UsageProps {
  wordDefinition: HanziiWordDetails | null;
  isLoading: boolean;
  error: string | null;
  currentWord: WordItem;
}

export const Usage: React.FC<UsageProps> = ({
  wordDefinition,
  isLoading,
  error,
  currentWord
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkTimestamp, setBookmarkTimestamp] = useState<number | null>(null);
  const wordAvailable = wordDefinition && !isLoading && !error;

  // Use global word items state and language
  const { refreshWordItems } = useWordItems();
  const { language } = useLanguage();

  // Function to highlight matching text with the current word
  const highlightMatchingText = (text: string): React.ReactNode => {
    if (!currentWord?.word || !text) return text;

    const wordToMatch = currentWord.word;
    const regex = new RegExp(`(${wordToMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === wordToMatch.toLowerCase()) {
        return (
          <span key={index} className="text-blue font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Check if word is bookmarked on component mount and when currentWord changes
  useEffect(() => {
    const bookmarkKey = `hanzii-bookmark-${currentWord.word}`;
    const bookmarkData = localStorage.getItem(bookmarkKey);

    if (bookmarkData) {
      try {
        const parsedData = JSON.parse(bookmarkData);
        setIsBookmarked(true);
        setBookmarkTimestamp(parsedData.timestamp);
      } catch (error) {
        setIsBookmarked(false);
        setBookmarkTimestamp(null);
      }
    } else {
      setIsBookmarked(false);
      setBookmarkTimestamp(null);
    }
  }, [currentWord.word]);

  // Toggle bookmark status
  const handleBookmarkToggle = () => {
    const bookmarkKey = `hanzii-bookmark-${currentWord.word}`;

    if (isBookmarked) {
      // Remove bookmark
      localStorage.removeItem(bookmarkKey);
      setIsBookmarked(false);
      // Refresh the word items list
      refreshWordItems();
    } else {
      // Add bookmark
      const bookmarkData = {
        word: currentWord.word,
        timestamp: Date.now(),
        definition: wordDefinition?.definition || '',
        pronunciation: wordDefinition?.pronunciation || ''
      };
      localStorage.setItem(bookmarkKey, JSON.stringify(bookmarkData));
      setIsBookmarked(true);
      // Refresh the word items list
      refreshWordItems();
    }
  };

  // Format the bookmark timestamp
  const formattedBookmarkTime = bookmarkTimestamp
    ? new Date(bookmarkTimestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
    : '';

  return (
    <div className="flex flex-col p-6">
      {/* Word title with bookmark button */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <h2 className="text-4xl font-bold text-pink text-center font-chinese">{currentWord.word}</h2>
        <button
          onClick={handleBookmarkToggle}
          className={`
            flex items-center justify-center w-10 h-10 rounded-full 
            transition-all duration-200 ease-in-out
            transform hover:scale-110 active:scale-95
            ${isBookmarked
              ? 'bg-yellow text-base hover:bg-peach'
              : 'bg-surface0 text-subtext1 hover:bg-surface1 hover:text-yellow'
            }
          `}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <span className="text-lg">
            {isBookmarked ? '★' : '☆'}
          </span>
        </button>
      </div>

      {/* Pronunciation */}
      {wordAvailable && wordDefinition.pronunciation && (
        <div className="text-lg text-maroon mb-6 text-center">
          {language === 'vi' && hanziService.getWordHanViet(currentWord.word)
            ? `/${wordDefinition.pronunciation}/ [${hanziService.getWordHanViet(currentWord.word)}]`
            : `/${wordDefinition.pronunciation}/`
          }
        </div>
      )}

      {/* Content area */}
      <div className="flex flex-col">
        {isLoading && (
          <div className="text-center text-subtext1 text-lg">
            Loading definition...
          </div>
        )}

        {error && (
          <div className="text-center text-red text-lg">
            {error}
          </div>
        )}

        {wordAvailable && (
          <div className="space-y-6">
            {/* Word Image */}
            {wordDefinition.imageUrl && (
              <div className="text-center">
                <WordImage
                  imageUrl={wordDefinition.imageUrl}
                  fallbackUrl={wordDefinition.fallbackImageUrl}
                  word={currentWord.word}
                  className="w-32 h-20 mx-auto"
                />
              </div>
            )}

            {/* Measure Words */}
            {wordDefinition.measure && (
              <div className="text-text">
                <CollapsibleSection
                  title="Measure Words"
                  defaultExpanded={true}
                >
                  <div className="text-text font-medium text-sm font-chinese">
                    {wordDefinition.measure.measure}
                  </div>
                  {wordDefinition.measure.pinyin && (
                    <div className="text-xs text-subtext1 italic mt-1">
                      {language === 'vi' && hanziService.getWordHanViet(wordDefinition.measure.measure)
                        ? `/${wordDefinition.measure.pinyin}/ [${hanziService.getWordHanViet(wordDefinition.measure.measure)}]`
                        : `/${wordDefinition.measure.pinyin}/`
                      }
                    </div>
                  )}
                </CollapsibleSection>
              </div>
            )}

            {/* Part of Speech Sections */}
            {wordDefinition.partOfSpeechSections && wordDefinition.partOfSpeechSections.length > 0 && (
              <div className="space-y-4 text-text">
                {wordDefinition.partOfSpeechSections.map((section, sectionIndex) => (
                  <CollapsibleSection
                    key={sectionIndex}
                    title={getPartOfSpeechLabel(section.kind, language)}
                    defaultExpanded={true}
                  >
                    <div className="space-y-3">
                      {section.meanings.map((meaning, meaningIndex) => (
                        <div key={meaningIndex} className="border-l-2 border-blue pl-3">
                          <div className="font-medium text-text mb-1 text-sm">
                            {highlightMatchingText(meaning.mean)}
                          </div>
                          {meaning.explain && (
                            <div className="text-sm text-subtext1 mb-2 italic">
                              {highlightMatchingText(meaning.explain)}
                            </div>
                          )}
                          {meaning.examples && meaning.examples.length > 0 && (
                            <div className="space-y-1">
                              {meaning.examples.map((example, exampleIndex) => (
                                <div key={exampleIndex} className="bg-base p-2 rounded text-sm border border-surface2">
                                  <div className="text-text font-medium mb-1 font-chinese">
                                    {highlightMatchingText(example.chinese)}
                                  </div>
                                  <div className="text-subtext1">
                                    {highlightMatchingText(example.english)}
                                  </div>
                                  {example.pinyin && (
                                    <div className="text-sm text-subtext0 italic mt-1">
                                      {language === 'vi' && hanziService.getWordHanViet(example.chinese)
                                        ? `/${example.pinyin}/ [${hanziService.getWordHanViet(example.chinese)}]`
                                        : `/${example.pinyin}/`
                                      }
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                ))}
              </div>
            )}

            {/* Fallback Meanings (for simple structures) */}
            {(!wordDefinition.partOfSpeechSections || wordDefinition.partOfSpeechSections.length === 0) &&
              wordDefinition.meanings && wordDefinition.meanings.length > 0 && (
                <div className="text-text">
                  <CollapsibleSection
                    title="Meanings"
                    defaultExpanded={true}
                  >
                    <div className="space-y-2">
                      {wordDefinition.meanings.slice(0, 4).map((meaning, index) => (
                        <div key={index} className="bg-base p-3 rounded border border-surface2">
                          <span className="text-xs font-medium text-mauve mr-2">{index + 1}.</span>
                          <span className="text-sm">{highlightMatchingText(meaning)}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                </div>
              )}

            {/* Definition (fallback if no part of speech sections and no meanings) */}
            {wordDefinition.definition &&
              (!wordDefinition.partOfSpeechSections || wordDefinition.partOfSpeechSections.length === 0) &&
              (!wordDefinition.meanings || wordDefinition.meanings.length === 0) && (
                <div className="text-text">
                  <CollapsibleSection
                    title="Definition"
                    defaultExpanded={true}
                  >
                    <div className="text-sm leading-relaxed">
                      {highlightMatchingText(wordDefinition.definition)}
                    </div>
                  </CollapsibleSection>
                </div>
              )}

            {/* Usage Examples (fallback for simple structures) */}
            {(!wordDefinition.partOfSpeechSections || wordDefinition.partOfSpeechSections.length === 0) &&
              wordDefinition.usage && wordDefinition.usage.length > 0 && (
                <div className="text-text">
                  <CollapsibleSection
                    title="Usage Examples"
                    defaultExpanded={true}
                  >
                    <div className="space-y-3">
                      {wordDefinition.usage.slice(0, 3).map((usage, index) => (
                        <div key={index} className="bg-base p-3 rounded border border-surface2">
                          <div className="text-text font-medium mb-1 text-base font-chinese">
                            {highlightMatchingText(usage.chinese)}
                          </div>
                          <div className="text-subtext1 italic text-sm">
                            {highlightMatchingText(usage.english)}
                          </div>
                          {usage.pinyin && (
                            <div className="text-sm text-subtext0 mt-1 italic">
                              {language === 'vi' && hanziService.getWordHanViet(usage.chinese)
                                ? `/${usage.pinyin}/ [${hanziService.getWordHanViet(usage.chinese)}]`
                                : `/${usage.pinyin}/`
                              }
                            </div>
                          )}
                          {usage.source && (
                            <div className="text-sm text-subtext0 mt-1">
                              — {usage.source}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                </div>
              )}

            {/* Simple Examples (fallback) */}
            {(!wordDefinition.partOfSpeechSections || wordDefinition.partOfSpeechSections.length === 0) &&
              wordDefinition.examples && wordDefinition.examples.length > 0 &&
              (!wordDefinition.usage || wordDefinition.usage.length === 0) && (
                <div className="text-text">
                  <CollapsibleSection
                    title="Examples"
                    defaultExpanded={true}
                  >
                    <div className="space-y-2">
                      {wordDefinition.examples.slice(0, 3).map((example, index) => (
                        <div key={index} className="bg-base p-3 rounded border border-surface2 italic text-sm">
                          "{highlightMatchingText(example)}"
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                </div>
              )}


            {/* Synonyms and Antonyms */}
            {wordDefinition.synonyms && (
              <div className="space-y-3 text-text">
                {wordDefinition.synonyms.syno && wordDefinition.synonyms.syno.length > 0 && (
                  <CollapsibleSection
                    title={getPartOfSpeechLabel('syno', language)}
                    defaultExpanded={true}
                    className="p-0"
                  >
                    <div className="flex flex-wrap gap-1">
                      {wordDefinition.synonyms.syno.slice(0, 6).map((synonym, index) => (
                        <div key={index} className="bg-base text-text px-2 py-1 rounded text-xs font-chinese border border-surface2">
                          <div>{highlightMatchingText(synonym)}</div>
                          {language === 'vi' && hanziService.getWordHanViet(synonym) && (
                            <div className="text-xs text-subtext1 italic mt-0.5">
                              [{hanziService.getWordHanViet(synonym)}]
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                {wordDefinition.synonyms.anto && wordDefinition.synonyms.anto.length > 0 && (
                  <CollapsibleSection
                    title={getPartOfSpeechLabel('anto', language)}
                    defaultExpanded={true}
                    className="p-0"
                  >
                    <div className="flex flex-wrap gap-1">
                      {wordDefinition.synonyms.anto.slice(0, 6).map((antonym, index) => (
                        <div key={index} className="bg-base text-text px-2 py-1 rounded text-xs font-chinese border border-surface2">
                          <div>{highlightMatchingText(antonym)}</div>
                          {language === 'vi' && hanziService.getWordHanViet(antonym) && (
                            <div className="text-xs text-subtext1 italic mt-0.5">
                              [{hanziService.getWordHanViet(antonym)}]
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}
              </div>
            )}
          </div>
        )}

        {!wordDefinition && !isLoading && !error && (
          <div className="text-center text-subtext1 text-lg">
            No definition found
          </div>
        )}
      </div>

      {/* Timestamp at bottom - only show if bookmarked */}
      {isBookmarked && bookmarkTimestamp && (
        <div className="bg-surface0 px-4 py-2 rounded-md text-subtext1 text-sm text-center mt-4">
          Bookmarked at {formattedBookmarkTime}
        </div>
      )}
    </div>
  );
}; 

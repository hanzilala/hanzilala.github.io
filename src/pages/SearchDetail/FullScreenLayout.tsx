import React from 'react';
import { HanziiWordDetails, Language } from '../../api/hanzii';
import { useTheme, useLanguage } from '../../components/ThemeProvider';
import { getPartOfSpeechLabel } from '../../config/partOfSpeechMapping';
import { WordImage } from '../../components/WordImage';
import { hanziService } from '../../services/hanziService';
import { CollapsibleSection } from '../../components/CollapsibleSection';
import { Kanji } from './Kanji';

export interface FullScreenLayoutProps {
  wordDefinition: HanziiWordDetails | null;
  isLoading: boolean;
  error: string | null;
  currentWord: WordItem;
  onNextWord: () => void;
}

export const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({
  wordDefinition,
  isLoading,
  error,
  currentWord,
  onNextWord
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const wordAvailable = wordDefinition && !isLoading && !error;

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

  return (
    <div className="w-full h-screen bg-base text-text overflow-auto">
      <div className="flex flex-col items-center px-6 py-8 pb-20 max-w-6xl mx-auto">

        {/* Kanji Characters Section */}
        <div className="mb-8 w-full flex justify-center">
          <Kanji 
            wordDefinition={wordDefinition}
            isLoading={isLoading}
            error={error}
            currentWord={currentWord}
          />
        </div>

        {/* Loading/Error states */}
        {isLoading && (
          <div className="text-center text-subtext1 text-lg mb-8">
            Loading definition...
          </div>
        )}

        {error && (
          <div className="text-center text-red text-lg mb-8">
            {error}
          </div>
        )}

        {/* Pinyin/Pronunciation */}
        {wordAvailable && wordDefinition.pronunciation && (
          <div className="mb-4 text-center">
            <div className="text-xl text-maroon font-medium">
              {language === 'vi' && hanziService.getWordHanViet(currentWord.word)
                ? `/${wordDefinition.pronunciation}/ [${hanziService.getWordHanViet(currentWord.word)}]`
                : `/${wordDefinition.pronunciation}/`
              }
            </div>
          </div>
        )}

        {/* Word Image */}
        {wordAvailable && wordDefinition.imageUrl && (
          <div className="mb-6 text-center">
            <WordImage
              imageUrl={wordDefinition.imageUrl}
              fallbackUrl={wordDefinition.fallbackImageUrl}
              word={currentWord.word}
              className="w-48 h-32 mx-auto"
            />
          </div>
        )}

        {/* Definitions and Usage */}
        {wordAvailable && (
          <div className="w-full max-w-4xl">
            {/* Measure Words and Synonyms/Antonyms in Table Layout */}
            {(wordDefinition.measure || wordDefinition.synonyms) && (
              <div className="mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Measure Words */}
                  {wordDefinition.measure && (
                    <CollapsibleSection
                      title={getPartOfSpeechLabel('measure', language)}
                      defaultExpanded={true}
                    >
                      <div className="text-text font-medium text-base font-chinese">
                        {wordDefinition.measure.measure}
                      </div>
                      {wordDefinition.measure.pinyin && (
                        <div className="text-sm text-subtext1 italic mt-2">
                          {language === 'vi' && hanziService.getWordHanViet(wordDefinition.measure.measure)
                            ? `/${wordDefinition.measure.pinyin}/ [${hanziService.getWordHanViet(wordDefinition.measure.measure)}]`
                            : `/${wordDefinition.measure.pinyin}/`
                          }
                        </div>
                      )}
                    </CollapsibleSection>
                  )}

                  {/* Synonyms and Antonyms */}
                  {wordDefinition.synonyms && (
                    <div className="space-y-4">
                      {wordDefinition.synonyms.syno && wordDefinition.synonyms.syno.length > 0 && (
                        <CollapsibleSection
                          title={getPartOfSpeechLabel('syno', language)}
                          defaultExpanded={true}
                        >
                          <div className="flex flex-wrap gap-2">
                            {wordDefinition.synonyms.syno.slice(0, 8).map((synonym, index) => (
                              <div key={index} className="bg-base text-text px-2 py-1 rounded text-sm font-chinese border border-surface2">
                                <div>{highlightMatchingText(synonym)}</div>
                                {language === 'vi' && hanziService.getWordHanViet(synonym) && (
                                  <div className="text-xs text-subtext1 italic mt-1">
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
                        >
                          <div className="flex flex-wrap gap-2">
                            {wordDefinition.synonyms.anto.slice(0, 8).map((antonym, index) => (
                              <div key={index} className="bg-base text-text px-2 py-1 rounded text-sm font-chinese border border-surface2">
                                <div>{highlightMatchingText(antonym)}</div>
                                {language === 'vi' && hanziService.getWordHanViet(antonym) && (
                                  <div className="text-xs text-subtext1 italic mt-1">
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
              </div>
            )}

            {/* Part of Speech Sections */}
            {wordDefinition.partOfSpeechSections && wordDefinition.partOfSpeechSections.length > 0 && (
              <div className="space-y-6">
                {wordDefinition.partOfSpeechSections.map((section, sectionIndex) => (
                  <CollapsibleSection
                    key={sectionIndex}
                    title={getPartOfSpeechLabel(section.kind, language)}
                    defaultExpanded={true}
                    className="bg-base border-surface2"
                  >
                    <div className="space-y-4">
                      {section.meanings.map((meaning, meaningIndex) => (
                        <div key={meaningIndex} className="border-l-4 border-blue pl-4">
                          <div className="font-medium text-text mb-2">
                            {highlightMatchingText(meaning.mean)}
                          </div>
                          {meaning.explain && (
                            <div className="text-sm text-subtext1 mb-3 italic">
                              {highlightMatchingText(meaning.explain)}
                            </div>
                          )}
                          {meaning.examples && meaning.examples.length > 0 && (
                            <div className="space-y-2">
                              {meaning.examples.map((example, exampleIndex) => (
                                <div key={exampleIndex} className="bg-surface0 p-3 rounded border border-surface1">
                                  <div className="text-text font-medium mb-1 text-base font-chinese">
                                    {highlightMatchingText(example.chinese)}
                                  </div>
                                  <div className="text-subtext1 text-sm mb-1">
                                    {highlightMatchingText(example.english)}
                                  </div>
                                  {example.pinyin && (
                                    <div className="text-sm text-subtext0 italic">
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
                <div className="text-text mb-8">
                  <CollapsibleSection
                    title="Meanings"
                    defaultExpanded={true}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {wordDefinition.meanings.map((meaning, index) => (
                        <div key={index} className="bg-base p-3 rounded-md border border-surface2">
                          <span className="text-sm font-medium text-mauve mr-2">{index + 1}.</span>
                          <span className="text-base">{highlightMatchingText(meaning)}</span>
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
                <div className="text-text mb-8">
                  <CollapsibleSection
                    title="Definition"
                    defaultExpanded={true}
                  >
                    <div className="text-lg leading-relaxed">{highlightMatchingText(wordDefinition.definition)}</div>
                  </CollapsibleSection>
                </div>
              )}

            {/* Usage Examples (fallback for simple structures) */}
            {(!wordDefinition.partOfSpeechSections || wordDefinition.partOfSpeechSections.length === 0) &&
              wordDefinition.usage && wordDefinition.usage.length > 0 && (
                <div className="text-base text-subtext1 mb-8">
                  <CollapsibleSection
                    title="Usage Examples"
                    defaultExpanded={true}
                  >
                    <div className="space-y-4">
                      {wordDefinition.usage.slice(0, 5).map((usage, index) => (
                        <div key={index} className="bg-base p-4 rounded-md border border-surface2">
                          <div className="text-text font-medium mb-2 text-lg font-chinese">
                            {highlightMatchingText(usage.chinese)}
                          </div>
                          <div className="text-subtext1 italic">
                            {highlightMatchingText(usage.english)}
                          </div>
                          {usage.pinyin && (
                            <div className="text-sm text-subtext0 italic">
                              {language === 'vi' && hanziService.getWordHanViet(usage.chinese)
                                ? `/${usage.pinyin}/ [${hanziService.getWordHanViet(usage.chinese)}]`
                                : `/${usage.pinyin}/`
                              }
                            </div>
                          )}
                          {usage.source && (
                            <div className="text-sm text-subtext0 mt-2">
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
                <div className="text-base text-subtext1">
                  <CollapsibleSection
                    title="Examples"
                    defaultExpanded={true}
                  >
                    <ul className="list-none space-y-3">
                      {wordDefinition.examples.slice(0, 5).map((example, index) => (
                        <li key={index} className="italic text-base leading-relaxed bg-base p-3 rounded-md border border-surface2">
                          "{highlightMatchingText(example)}"
                        </li>
                      ))}
                    </ul>
                  </CollapsibleSection>
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
    </div>
  );
}; 

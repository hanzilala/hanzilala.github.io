// Part of Speech mapping - now uses i18n system
import { Language } from '../api/hanzii';
import { usePartOfSpeechTranslation } from '../i18n/partOfSpeech';

// Backward compatibility wrapper
export const getPartOfSpeechLabel = (kind: string, language: Language = 'en'): string => {
  const { getPartOfSpeechLabel: translate } = usePartOfSpeechTranslation(language);
  return translate(kind);
};


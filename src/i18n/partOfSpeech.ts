// Part of Speech i18n mappings
// Source: https://hanzii.net/assets/i18n/en.json and https://hanzii.net/assets/i18n/vi.json

export type Language = 'vi' | 'en';

export const partOfSpeechTranslations: Record<Language, Record<string, string>> = {
  en: {
    // Basic parts of speech
    'adj': 'adjective',
    'adv': 'adverb',
    'n': 'noun',
    'v': 'verb',
    'prep': 'preposition',
    'intj': 'interjection',
    'numb': 'numeral',
    'pro': 'pronoun',
    'conj': 'conjunction',
    'part': 'particle',

    // Extended parts of speech
    'class': 'Classifier',
    'measure': 'Measure',
    'av': 'Auxiliary verbs',
    'sv': 'Separable verb',
    'mpart': 'modal particle',
    'pref': 'prefix',
    'suff': 'suffix',
    'onom': 'onoma:poeia',
    'dist': 'distinguishing word',
    'locativ': 'locative word',
    'nlocal': 'local noun',
    'time': 'time word',
    'stt': 'state word',
    'punct': 'punctuation',

    // Additional mappings that might appear
    'num': 'numeral', // alternative for numb
    'pron': 'pronoun', // alternative for pro
    'aux': 'auxiliary', // alternative for av
    'modal': 'modal',
    'det': 'determiner',
    'art': 'article',
    'syno': 'synonyms',
    'anto': 'antonyms'
  },
  vi: {
    // Basic parts of speech
    'adj': 'Tính từ',
    'adv': 'Phó từ',
    'n': 'Danh từ',
    'v': 'Động từ',
    'prep': 'Giới từ',
    'intj': 'Thán từ',
    'numb': 'Số từ',
    'pro': 'Đại từ',
    'conj': 'Liên Từ',
    'part': 'Trợ từ',

    // Extended parts of speech
    'class': 'Từ chỉ số lượng',
    'measure': 'Lượng từ',
    'av': 'Trợ động từ',
    'sv': 'Động từ li hợp',
    'mpart': 'Trợ/tiểu từ thuộc trạng/lối, trợ/tiểu từ ngữ khí',
    'pref': 'Tiền tố',
    'suff': 'Hậu tố',
    'onom': 'Từ tượng thanh',
    'dist': 'Từ phân loại',
    'locativ': 'Từ mượn',
    'nlocal': 'Danh từ địa phương',
    'time': 'Từ chỉ thời gian',
    'stt': 'Từ chỉ trạng thái',
    'punct': 'Dấu câu',

    // Additional mappings that might appear
    'num': 'Số từ', // alternative for numb
    'pron': 'Đại từ', // alternative for pro
    'aux': 'Trợ từ', // alternative for av
    'modal': 'Từ khuyết thiếu',
    'det': 'Từ hạn định',
    'art': 'Mạo từ',
    'syno': 'Từ cận nghĩa',
    'anto': 'Từ trái nghĩa'
  }
};

export const usePartOfSpeechTranslation = (language: Language) => {
  return {
    getPartOfSpeechLabel: (kind: string): string => {
      return partOfSpeechTranslations[language][kind] || kind.toUpperCase();
    }
  };
}; 
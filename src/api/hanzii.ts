// API base URL
const HANZII_API_BASE = 'https://api.hanzii.net/api';

// Supported languages
export type Language = 'en' | 'vi';

// Import part of speech mapping
import { getPartOfSpeechLabel } from '../config/partOfSpeechMapping';
import { generateImageUrl, isChinese } from '../utils/md5';

// Types for the API response
export interface HanziiWordDetails {
  id: string;
  word: string;
  pronunciation?: string;
  definition?: string;
  examples?: string[];
  pinyin?: string;
  content?: any[];
  usage?: UsageExample[];
  meanings?: string[];
  partOfSpeechSections?: PartOfSpeechSection[];
  measure?: MeasureInfo;
  synonyms?: SynonymInfo;
  imageUrl?: string;
  fallbackImageUrl?: string;
  audioId?: number;
  // Add more fields as needed based on the actual API response
}

export interface MeasureInfo {
  measure: string;
  examples?: string;
  pinyin?: string;
}

export interface SynonymInfo {
  syno?: string[]; // synonyms
  anto?: string[]; // antonyms
}

export interface UsageExample {
  chinese: string;
  english: string;
  source?: string;
  pinyin?: string;
}

export interface PartOfSpeechSection {
  kind: string; // adj, adv, n, v, prep, intj, num, etc.
  kindLabel: string; // Adjective, Adverb, Noun, Verb, etc.
  meanings: MeaningWithExamples[];
}

export interface MeaningWithExamples {
  mean: string;
  explain?: string;
  examples: UsageExample[];
}

// Function to get word details with language support
export const getWordDetails = async (word: string, language: Language = 'vi'): Promise<HanziiWordDetails> => {
  const encodedWord = encodeURIComponent(word);
  const url = `${HANZII_API_BASE}/search/${language}/${encodedWord}?type=word&page=1&limit=50`;
  
  console.log('Making API request to:', url);
  
  const response = await fetch(url);
  
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Raw API response:', data);
  
  // Parse the response based on the actual API structure
  if (data.result && Array.isArray(data.result) && data.result.length > 0) {
    const firstResult = data.result[0];
    
    // Extract pronunciation
    const pronunciation = firstResult.pinyin || '';
    
    // Extract definition and meanings from content
    let definition = '';
    let examples: string[] = [];
    let usage: UsageExample[] = [];
    let meanings: string[] = [];
    let partOfSpeechSections: PartOfSpeechSection[] = [];

    // Use the imported part of speech mapping function
    
    if (firstResult.content && Array.isArray(firstResult.content)) {
      // Handle structured content with part of speech
      if (firstResult.content.length > 0 && firstResult.content[0].kind) {
        firstResult.content.forEach((section: any) => {
          if (section.kind && section.means && Array.isArray(section.means)) {
            const meaningsWithExamples: MeaningWithExamples[] = section.means.map((meanItem: any) => {
              const examplesList: UsageExample[] = [];

              if (meanItem.examples && Array.isArray(meanItem.examples)) {
                meanItem.examples.forEach((ex: any) => {
                  if (ex.e && ex.m) {
                    examplesList.push({
                      chinese: ex.e,
                      english: ex.m,
                      pinyin: ex.p || ex.p_cn,
                      source: ex.source
                    });
                  }
                });
              }

              return {
                mean: meanItem.mean || '',
                explain: meanItem.explain,
                examples: examplesList
              };
            });

            partOfSpeechSections.push({
              kind: section.kind,
              kindLabel: getPartOfSpeechLabel(section.kind, language),
              meanings: meaningsWithExamples
            });

            // Collect all meanings for fallback definition
            section.means.forEach((meanItem: any) => {
              if (meanItem.mean) {
                meanings.push(meanItem.mean);
              }
            });
          }
        });

        // Create definition from all meanings
        definition = meanings.join('; ');
      } else {
      // Handle simple content structure (like kanji)
        const content = firstResult.content[0];

        if (content.means) {
          // Handle different meaning structures
          if (content.means.tdpt && Array.isArray(content.means.tdpt)) {
            meanings = content.means.tdpt;
            definition = content.means.tdpt.join('; ');
          } else if (Array.isArray(content.means)) {
            definition = content.means.map((m: any) => m.mean || m).join('; ');

            // Extract examples from means array
            content.means.forEach((mean: any) => {
              if (mean.examples && Array.isArray(mean.examples)) {
                mean.examples.forEach((ex: any) => {
                  if (ex.e) examples.push(ex.e);
                  if (ex.e && ex.m) {
                    usage.push({
                      chinese: ex.e,
                      english: ex.m,
                      pinyin: ex.p || ex.p_cn,
                      source: ex.source
                    });
                  }
                });
              }
            });
          }
        }
      }
    }

    // If no definition found, try to extract from meanings
    if (!definition && meanings.length > 0) {
      definition = meanings.join('; ');
    }
    
    // Generate image URLs using MD5 hash like the original website
    const imageUrl = isChinese(firstResult.word) ? generateImageUrl(firstResult.word) : undefined;
    const fallbackImageUrl = isChinese(firstResult.word) 
      ? `https://th.bing.com/th?q=${encodeURIComponent(firstResult.word)}&w=450&h=250&c=7&rs=1&p=0&o=5&dpr=2&pid=1.7&mkt=en-WW&cc=VN&setlang=zh&adlt=moderate&t=1`
      : undefined;

    return {
      id: firstResult._id || firstResult.id?.toString() || '',
      word: firstResult.word,
      pronunciation,
      definition,
      examples,
      pinyin: firstResult.pinyin,
      content: firstResult.content,
      usage,
      meanings,
      partOfSpeechSections,
      measure: firstResult.measure || undefined,
      synonyms: firstResult.snym || undefined,
      imageUrl,
      fallbackImageUrl,
      audioId: firstResult.audio_id
    };
  } else {
    throw new Error('No word details found in API response');
  }
}; 

// ================================
// NOTEBOOKS API
// ================================

export interface PersonalNotebook {
  id: number;
  name: string;
  language: string;
  created_at: number;
  notebooks_count: number;
  sync_time: number;
  deleted: boolean;
}

export interface NotebooksApiResponse {
  total: number;
  result: PersonalNotebook[];
}

/**
 * Create a custom error class for API errors
 */
export class HanziiApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'HanziiApiError';
    this.status = status;
  }
}

/**
 * Fetch personal notebooks from the API
 * @param page - Page number (default: 1)
 * @param limit - Number of items per page (default: 100)
 * @returns Promise with notebooks data or throws error
 */
export const fetchPersonalNotebooks = async (
  page: number = 1,
  limit: number = 100
): Promise<PersonalNotebook[]> => {
  const token = localStorage.getItem('hanzii-auth-token');

  if (!token) {
    throw new HanziiApiError('No authentication token found');
  }

  try {
    const response = await fetch(`${HANZII_API_BASE}/category?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new HanziiApiError('Authentication expired. Please login again.', 401);
      } else {
        throw new HanziiApiError(`Failed to fetch notebooks (${response.status})`, response.status);
      }
    }

    const result: NotebooksApiResponse = await response.json();
    console.log('API Response:', result); // Debug log

    if (result.total !== undefined && Array.isArray(result.result)) {
      return result.result;
    } else {
      throw new HanziiApiError('Invalid response format from API');
    }
  } catch (error) {
    if (error instanceof HanziiApiError) {
      throw error;
    }

    console.error('Error fetching personal notebooks:', error);
    throw new HanziiApiError('Network error. Please try again.');
  }
}; 

// API base URL
const HANZII_API_BASE = 'https://api.hanzii.net/api';

// Types for the API response
export interface HanziiWordDetails {
  id: string;
  word: string;
  pronunciation?: string;
  definition?: string;
  examples?: string[];
  phonetic?: string;
  content?: any[];
  // Add more fields as needed based on the actual API response
}

// Function to get word details
export const getWordDetails = async (word: string): Promise<HanziiWordDetails> => {
  const encodedWord = encodeURIComponent(word);
  const url = `${HANZII_API_BASE}/search/vi/${encodedWord}?type=word&page=1&limit=50`;
  
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
    const pronunciation = firstResult.phonetic || '';
    
    // Extract definition from content
    let definition = '';
    let examples: string[] = [];
    
    if (firstResult.content && Array.isArray(firstResult.content)) {
      const content = firstResult.content[0];
      if (content.means && Array.isArray(content.means)) {
        definition = content.means.map((m: any) => m.mean).join('; ');
        
        // Extract examples
        content.means.forEach((mean: any) => {
          if (mean.examples && Array.isArray(mean.examples)) {
            mean.examples.forEach((ex: any) => {
              if (ex.e) examples.push(ex.e);
            });
          }
        });
      }
    }
    
    return {
      id: firstResult._id || firstResult.id?.toString() || '',
      word: firstResult.word,
      pronunciation,
      definition,
      examples,
      phonetic: firstResult.phonetic,
      content: firstResult.content
    };
  } else {
    throw new Error('No word details found in API response');
  }
}; 
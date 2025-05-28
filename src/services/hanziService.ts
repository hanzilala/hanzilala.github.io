const HANZI_STORAGE_KEY = 'data-hanzi-3';
const HANZI_API_URL = 'https://hanzii.net/db/hanzi.json';

interface HanziData {
  [character: string]: string;
}

class HanziService {
  private hanziData: HanziData | null = null;
  private loadingPromise: Promise<HanziData> | null = null;

  /**
   * Initialize and load Hanzi data if not already cached
   */
  async initialize(): Promise<void> {
    try {
      // Check if data exists in localStorage
      const cachedData = localStorage.getItem(HANZI_STORAGE_KEY);
      
      if (cachedData) {
        this.hanziData = JSON.parse(cachedData);
        console.log('Hanzi data loaded from localStorage');
        return;
      }

      // If not cached, fetch from API
      await this.loadFromAPI();
    } catch (error) {
      console.error('Failed to initialize Hanzi service:', error);
    }
  }

  /**
   * Load Hanzi data from API and cache it
   */
  private async loadFromAPI(): Promise<HanziData> {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = fetch(HANZI_API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch Hanzi data: ${response.status}`);
        }
        return response.json();
      })
      .then((data: HanziData) => {
        // Cache the data
        localStorage.setItem(HANZI_STORAGE_KEY, JSON.stringify(data));
        this.hanziData = data;
        console.log('Hanzi data loaded from API and cached');
        return data;
      })
      .catch(error => {
        this.loadingPromise = null;
        throw error;
      });

    return this.loadingPromise;
  }

  /**
   * Get Hán Việt reading for a single character
   */
  getHanViet(character: string): string | null {
    if (!this.hanziData) {
      return null;
    }
    return this.hanziData[character] || null;
  }

  /**
   * Convert a Chinese word to Hán Việt reading
   * @param word - Chinese word/phrase
   * @returns Hán Việt reading or null if not available
   */
  getWordHanViet(word: string): string | null {
    if (!this.hanziData || !word) {
      return null;
    }

    const hanVietParts: string[] = [];
    
    for (const character of word) {
      const hanViet = this.getHanViet(character);
      if (hanViet) {
        hanVietParts.push(hanViet);
      } else {
        // If any character doesn't have Hán Việt, return null
        return null;
      }
    }

    return hanVietParts.join(' ');
  }



  /**
   * Check if Hanzi data is loaded
   */
  isLoaded(): boolean {
    return this.hanziData !== null;
  }

  /**
   * Force reload data from API
   */
  async reload(): Promise<void> {
    localStorage.removeItem(HANZI_STORAGE_KEY);
    this.hanziData = null;
    this.loadingPromise = null;
    await this.initialize();
  }
}

// Export singleton instance
export const hanziService = new HanziService();
export default hanziService; 
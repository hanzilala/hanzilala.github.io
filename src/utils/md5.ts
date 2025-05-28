import CryptoJS from 'crypto-js';

export const generateMD5 = (text: string): string => {
  return CryptoJS.MD5(text).toString();
};

export const generateImageUrl = (word: string): string => {
  const md5Hash = generateMD5(word);
  const primaryUrl = `https://assets.hanzii.net/img_word/${md5Hash}_h.jpg`;
  const fallbackUrl = `https://th.bing.com/th?q=${encodeURIComponent(word)}&w=450&h=250&c=7&rs=1&p=0&o=5&dpr=2&pid=1.7&mkt=en-WW&cc=VN&setlang=zh&adlt=moderate&t=1`;
  
  return primaryUrl;
};

export const isChinese = (text: string): boolean => {
  // Check if text contains Chinese characters
  return /[\u4e00-\u9fff]/.test(text);
}; 
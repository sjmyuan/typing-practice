import { pinyin } from 'pinyin-pro';

/**
 * Detect if a string contains Chinese characters
 */
export const containsChinese = (text: string): boolean => {
  return /[\u4e00-\u9fff]/.test(text);
};

/**
 * Convert Chinese characters to pinyin without tones
 * @param text - Chinese text to convert
 * @returns Pinyin without tone marks
 */
export const toPinyinWithoutTones = (text: string): string => {
  return pinyin(text, { 
    toneType: 'none',
    separator: '',
    v: true  // Enable v for ü
  });
};

/**
 * Get pinyin for a single Chinese character
 * @param char - Single Chinese character
 * @returns Pinyin with tone marks for display
 */
export const getPinyinForChar = (char: string): string => {
  if (!containsChinese(char)) {
    return char;
  }
  
  return pinyin(char, { 
    toneType: 'symbol',
    separator: '',
    v: true
  });
};

/**
 * Get pinyin without tones for a single Chinese character
 * @param char - Single Chinese character  
 * @returns Pinyin without tone marks for input validation
 */
export const getPinyinWithoutTonesForChar = (char: string): string => {
  if (!containsChinese(char)) {
    return char;
  }
  
  return pinyin(char, { 
    toneType: 'none',
    separator: '',
    v: true
  });
};

/**
 * Normalize pinyin input by removing tones and converting to lowercase
 * @param input - User input to normalize
 * @returns Normalized pinyin
 */
export const normalizePinyinInput = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, (match) => {
      const toneMap: { [key: string]: string } = {
        'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
        'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
        'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
        'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
        'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
        'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v'
      };
      return toneMap[match] || match;
    });
};

/**
 * Check if the text is suitable for pinyin practice
 * @param text - Text to check
 * @returns True if text contains Chinese characters
 */
export const isPinyinPracticeText = (text: string): boolean => {
  return containsChinese(text);
};

import { describe, it, expect } from 'vitest';
import {
  containsChinese,
  toPinyinWithoutTones,
  getPinyinForChar,
  getPinyinWithoutTonesForChar,
  normalizePinyinInput,
  isPinyinPracticeText,
  containsChinesePunctuation,
  getEnglishPunctuationForChinese,
  isChineseCharacterOrPunctuation
} from './pinyinUtils';

describe('pinyinUtils', () => {
  describe('containsChinese', () => {
    it('returns true for Chinese characters', () => {
      expect(containsChinese('你好')).toBe(true);
      expect(containsChinese('学习')).toBe(true);
      expect(containsChinese('hello 你好')).toBe(true);
    });

    it('returns false for non-Chinese text', () => {
      expect(containsChinese('hello')).toBe(false);
      expect(containsChinese('123')).toBe(false);
      expect(containsChinese('hello world')).toBe(false);
      expect(containsChinese('')).toBe(false);
    });
  });

  describe('toPinyinWithoutTones', () => {
    it('converts Chinese text to pinyin without tones', () => {
      expect(toPinyinWithoutTones('你好')).toBe('nihao');
      expect(toPinyinWithoutTones('学习')).toBe('xuexi');
    });

    it('handles mixed text', () => {
      expect(toPinyinWithoutTones('hello你好')).toBe('hellonihao');
    });

    it('returns original text for non-Chinese', () => {
      expect(toPinyinWithoutTones('hello')).toBe('hello');
    });
  });

  describe('getPinyinForChar', () => {
    it('returns pinyin with tones for Chinese characters', () => {
      const result = getPinyinForChar('你');
      expect(result).toMatch(/[nǐí]/); // Should contain tone marks
    });

    it('returns original character for non-Chinese', () => {
      expect(getPinyinForChar('a')).toBe('a');
      expect(getPinyinForChar('1')).toBe('1');
    });
  });

  describe('getPinyinWithoutTonesForChar', () => {
    it('returns pinyin without tones for Chinese characters', () => {
      expect(getPinyinWithoutTonesForChar('你')).toBe('ni');
      expect(getPinyinWithoutTonesForChar('好')).toBe('hao');
    });

    it('returns original character for non-Chinese', () => {
      expect(getPinyinWithoutTonesForChar('a')).toBe('a');
      expect(getPinyinWithoutTonesForChar('!')).toBe('!');
    });
  });

  describe('normalizePinyinInput', () => {
    it('removes tone marks from pinyin', () => {
      expect(normalizePinyinInput('nǐ')).toBe('ni');
      expect(normalizePinyinInput('hǎo')).toBe('hao');
      expect(normalizePinyinInput('xué')).toBe('xue');
    });

    it('converts to lowercase', () => {
      expect(normalizePinyinInput('NI')).toBe('ni');
      expect(normalizePinyinInput('HAO')).toBe('hao');
    });

    it('handles mixed input', () => {
      expect(normalizePinyinInput('Nǐ')).toBe('ni');
      expect(normalizePinyinInput('HǍO')).toBe('hao');
    });

    it('handles v for ü', () => {
      expect(normalizePinyinInput('nǖ')).toBe('nv');
      expect(normalizePinyinInput('lǘ')).toBe('lv');
    });
  });

  describe('isPinyinPracticeText', () => {
    it('returns true for text with Chinese characters', () => {
      expect(isPinyinPracticeText('你好世界')).toBe(true);
      expect(isPinyinPracticeText('hello 你好')).toBe(true);
    });

    it('returns false for text without Chinese characters', () => {
      expect(isPinyinPracticeText('hello world')).toBe(false);
      expect(isPinyinPracticeText('123')).toBe(false);
      expect(isPinyinPracticeText('')).toBe(false);
    });
  });

  // Add tests for Chinese punctuation functionality
  describe('containsChinesePunctuation', () => {
    it('returns true for Chinese punctuation', () => {
      expect(containsChinesePunctuation('。')).toBe(true);
      expect(containsChinesePunctuation('，')).toBe(true);
      expect(containsChinesePunctuation('！')).toBe(true);
      expect(containsChinesePunctuation('？')).toBe(true);
      expect(containsChinesePunctuation('；')).toBe(true);
      expect(containsChinesePunctuation('：')).toBe(true);
      expect(containsChinesePunctuation('（')).toBe(true);
      expect(containsChinesePunctuation('）')).toBe(true);
      expect(containsChinesePunctuation('「')).toBe(true);
      expect(containsChinesePunctuation('」')).toBe(true);
    });

    it('returns false for English punctuation', () => {
      expect(containsChinesePunctuation('.')).toBe(false);
      expect(containsChinesePunctuation(',')).toBe(false);
      expect(containsChinesePunctuation('!')).toBe(false);
      expect(containsChinesePunctuation('?')).toBe(false);
      expect(containsChinesePunctuation(';')).toBe(false);
      expect(containsChinesePunctuation(':')).toBe(false);
      expect(containsChinesePunctuation('(')).toBe(false);
      expect(containsChinesePunctuation(')')).toBe(false);
    });

    it('returns false for Chinese characters', () => {
      expect(containsChinesePunctuation('你')).toBe(false);
      expect(containsChinesePunctuation('好')).toBe(false);
    });

    it('returns false for English characters', () => {
      expect(containsChinesePunctuation('a')).toBe(false);
      expect(containsChinesePunctuation('A')).toBe(false);
      expect(containsChinesePunctuation('1')).toBe(false);
    });
  });

  describe('getEnglishPunctuationForChinese', () => {
    it('returns correct English punctuation for Chinese punctuation', () => {
      expect(getEnglishPunctuationForChinese('。')).toBe('.');
      expect(getEnglishPunctuationForChinese('，')).toBe(',');
      expect(getEnglishPunctuationForChinese('！')).toBe('!');
      expect(getEnglishPunctuationForChinese('？')).toBe('?');
      expect(getEnglishPunctuationForChinese('；')).toBe(';');
      expect(getEnglishPunctuationForChinese('：')).toBe(':');
      expect(getEnglishPunctuationForChinese('（')).toBe('(');
      expect(getEnglishPunctuationForChinese('）')).toBe(')');
      expect(getEnglishPunctuationForChinese('「')).toBe('"');
      expect(getEnglishPunctuationForChinese('」')).toBe('"');
    });

    it('returns original character for non-Chinese punctuation', () => {
      expect(getEnglishPunctuationForChinese('.')).toBe('.');
      expect(getEnglishPunctuationForChinese('a')).toBe('a');
      expect(getEnglishPunctuationForChinese('你')).toBe('你');
    });
  });

  describe('isChineseCharacterOrPunctuation', () => {
    it('returns true for Chinese characters', () => {
      expect(isChineseCharacterOrPunctuation('你')).toBe(true);
      expect(isChineseCharacterOrPunctuation('好')).toBe(true);
    });

    it('returns true for Chinese punctuation', () => {
      expect(isChineseCharacterOrPunctuation('。')).toBe(true);
      expect(isChineseCharacterOrPunctuation('，')).toBe(true);
      expect(isChineseCharacterOrPunctuation('！')).toBe(true);
    });

    it('returns false for English characters and punctuation', () => {
      expect(isChineseCharacterOrPunctuation('a')).toBe(false);
      expect(isChineseCharacterOrPunctuation('.')).toBe(false);
      expect(isChineseCharacterOrPunctuation('!')).toBe(false);
    });
  });
});

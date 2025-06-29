import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  loadTangPoems, 
  getTangPoemsFromCache, 
  cacheTangPoems,
  getAuthors,
  getTitlesByAuthor,
  getPoemByAuthorAndTitle
} from './tangPoemsUtils';

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockTangPoemsData = {
  name: "唐诗三百首",
  items: [
    {
      num: 1,
      author: "张九龄",
      title: "感遇四首之一",
      text: "孤鸿海上来，池潢不敢顾。\n侧见双翠鸟，巢在三珠树。"
    },
    {
      num: 2,
      author: "张九龄", 
      title: "感遇四首之二",
      text: "兰叶春葳蕤，桂华秋皎洁。\n欣欣此生意，自尔为佳节。"
    },
    {
      num: 3,
      author: "李白",
      title: "月下独酌",
      text: "花间一壶酒，独酌无相亲。\n举杯邀明月，对影成三人。"
    }
  ]
};

describe('tangPoemsUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadTangPoems', () => {
    it('should load Tang poems data from API', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTangPoemsData,
      } as Response);

      const result = await loadTangPoems();
      
      expect(fetch).toHaveBeenCalledWith('/tang-poems.json');
      expect(result).toEqual(mockTangPoemsData);
    });

    it('should throw error when fetch fails', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(loadTangPoems()).rejects.toThrow('Failed to load Tang poems');
    });

    it('should throw error when network error occurs', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('Network error'));

      await expect(loadTangPoems()).rejects.toThrow('Network error');
    });
  });

  describe('getTangPoemsFromCache', () => {
    it('should return cached data when available', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTangPoemsData));

      const result = getTangPoemsFromCache();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('tang-poems-cache');
      expect(result).toEqual(mockTangPoemsData);
    });

    it('should return null when no cache available', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getTangPoemsFromCache();
      
      expect(result).toBeNull();
    });

    it('should return null when cache is invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const result = getTangPoemsFromCache();
      
      expect(result).toBeNull();
    });
  });

  describe('cacheTangPoems', () => {
    it('should cache Tang poems data', () => {
      cacheTangPoems(mockTangPoemsData);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tang-poems-cache',
        JSON.stringify(mockTangPoemsData)
      );
    });
  });

  describe('getAuthors', () => {
    it('should return unique list of authors', () => {
      const authors = getAuthors(mockTangPoemsData);
      
      expect(authors).toEqual(['张九龄', '李白']);
    });

    it('should return empty array for empty data', () => {
      const emptyData = { name: "test", items: [] };
      const authors = getAuthors(emptyData);
      
      expect(authors).toEqual([]);
    });
  });

  describe('getTitlesByAuthor', () => {
    it('should return titles for specific author', () => {
      const titles = getTitlesByAuthor(mockTangPoemsData, '张九龄');
      
      expect(titles).toEqual(['感遇四首之一', '感遇四首之二']);
    });

    it('should return empty array for non-existent author', () => {
      const titles = getTitlesByAuthor(mockTangPoemsData, '杜甫');
      
      expect(titles).toEqual([]);
    });
  });

  describe('getPoemByAuthorAndTitle', () => {
    it('should return poem for specific author and title', () => {
      const poem = getPoemByAuthorAndTitle(mockTangPoemsData, '李白', '月下独酌');
      
      expect(poem).toEqual({
        num: 3,
        author: "李白",
        title: "月下独酌",
        text: "花间一壶酒，独酌无相亲。\n举杯邀明月，对影成三人。"
      });
    });

    it('should return null for non-existent author and title combination', () => {
      const poem = getPoemByAuthorAndTitle(mockTangPoemsData, '杜甫', '春晓');
      
      expect(poem).toBeNull();
    });
  });
});

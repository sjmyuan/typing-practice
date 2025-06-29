export interface TangPoem {
  num: number;
  author: string;
  title: string;
  text: string;
}

export interface TangPoemsData {
  name: string;
  items: TangPoem[];
}

const CACHE_KEY = 'tang-poems-cache';

/**
 * Load Tang poems data from the public JSON file
 */
export async function loadTangPoems(): Promise<TangPoemsData> {
  const response = await fetch('/tang-poems.json');
  if (!response.ok) {
    throw new Error(`Failed to load Tang poems: ${response.status}`);
  }
  return await response.json();
}

/**
 * Get Tang poems data from localStorage cache
 */
export function getTangPoemsFromCache(): TangPoemsData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

/**
 * Cache Tang poems data in localStorage
 */
export function cacheTangPoems(data: TangPoemsData): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

/**
 * Get unique list of authors from Tang poems data
 */
export function getAuthors(data: TangPoemsData): string[] {
  const authors = new Set<string>();
  data.items.forEach(item => authors.add(item.author));
  return Array.from(authors);
}

/**
 * Get titles by specific author
 */
export function getTitlesByAuthor(data: TangPoemsData, author: string): string[] {
  return data.items
    .filter(item => item.author === author)
    .map(item => item.title);
}

/**
 * Get specific poem by author and title
 */
export function getPoemByAuthorAndTitle(data: TangPoemsData, author: string, title: string): TangPoem | null {
  const poem = data.items.find(item => item.author === author && item.title === title);
  return poem || null;
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AuthorSelection from './AuthorSelection';
import TitleSelection from './TitleSelection';
import ContentPreview from './ContentPreview';
import type { TangPoemsData, TangPoem } from '../utils/tangPoemsUtils';
import {
  getTangPoemsFromCache,
  loadTangPoems,
  cacheTangPoems,
  getAuthors,
  getTitlesByAuthor,
  getPoemByAuthorAndTitle
} from '../utils/tangPoemsUtils';

interface PoemBrowserProps {
  onStart: (text: string) => void;
  onBack: () => void;
}

type BrowserState = 'loading' | 'error' | 'authors' | 'titles' | 'preview';

const PoemBrowser: React.FC<PoemBrowserProps> = ({ onStart, onBack }) => {
  const { t } = useTranslation();
  const [state, setState] = useState<BrowserState>('loading');
  const [data, setData] = useState<TangPoemsData | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [selectedPoem, setSelectedPoem] = useState<TangPoem | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Try to load from cache first
        let poemsData = getTangPoemsFromCache();
        
        if (!poemsData) {
          // Load from API if no cache
          poemsData = await loadTangPoems();
          cacheTangPoems(poemsData);
        }
        
        setData(poemsData);
        setState('authors');        } catch {
          setError(t('poemBrowser.failedToLoadPoems'));
          setState('error');
      }
    };

    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthorSelect = (author: string) => {
    setSelectedAuthor(author);
    setState('titles');
  };

  const handleTitleSelect = (title: string) => {
    if (data) {
      const poem = getPoemByAuthorAndTitle(data, selectedAuthor, title);
      if (poem) {
        setSelectedPoem(poem);
        setState('preview');
      }
    }
  };

  const handleBackToAuthors = () => {
    setSelectedAuthor('');
    setState('authors');
  };

  const handleBackToTitles = () => {
    setSelectedPoem(null);
    setState('titles');
  };

  const handleStartPractice = (text: string) => {
    onStart(text);
  };

  if (state === 'loading') {
    return (
      <div className="text-center space-y-4">
        <p className="text-lg text-gray-600">{t('poemBrowser.loadingPoems')}</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
        >
          {t('buttons.backToOptions')}
        </button>
      </div>
    );
  }

  if (state === 'authors' && data) {
    const authors = getAuthors(data);
    return (
      <AuthorSelection
        authors={authors}
        onSelect={handleAuthorSelect}
        onBack={onBack}
      />
    );
  }

  if (state === 'titles' && data) {
    const titles = getTitlesByAuthor(data, selectedAuthor);
    return (
      <TitleSelection
        author={selectedAuthor}
        titles={titles}
        onSelect={handleTitleSelect}
        onBack={handleBackToAuthors}
      />
    );
  }

  if (state === 'preview' && selectedPoem) {
    return (
      <ContentPreview
        poem={selectedPoem}
        onStart={handleStartPractice}
        onBack={handleBackToTitles}
      />
    );
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-gray-600">{t('poemBrowser.somethingWentWrong')}</p>
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
      >
        {t('buttons.backToOptions')}
      </button>
    </div>
  );
};

export default PoemBrowser;

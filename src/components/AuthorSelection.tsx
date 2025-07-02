import { useTranslation } from 'react-i18next';

interface AuthorSelectionProps {
  authors: string[];
  onSelect: (author: string) => void;
  onBack: () => void;
}

const AuthorSelection: React.FC<AuthorSelectionProps> = ({ authors, onSelect, onBack }) => {
  const { t } = useTranslation();
  
  if (authors.length === 0) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">{t('poemBrowser.selectAuthor')}</h2>
        <p className="text-gray-600">{t('poemBrowser.loadingAuthors')}</p>
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

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">{t('poemBrowser.selectAuthor')}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {authors.map((author) => (
          <button
            key={author}
            type="button"
            onClick={() => onSelect(author)}
            className="px-6 py-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 text-lg font-medium text-gray-800"
          >
            {author}
          </button>
        ))}
      </div>
      
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

export default AuthorSelection;

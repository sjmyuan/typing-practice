import React from 'react';
import { useTranslation } from 'react-i18next';

interface CompletionScreenProps {
  accuracy: number;
  onRestart: () => void;
  onStartNew: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ accuracy, onRestart, onStartNew }) => {
  const { t } = useTranslation();
  const handleRestartClick = () => {
    if (typeof onRestart === 'function') {
      onRestart();
    }
  };

  const handleStartNewClick = () => {
    if (typeof onStartNew === 'function') {
      onStartNew();
    }
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-green-600 mb-2">{t('headings.practiceComplete', 'Practice Complete!')}</h3>
        <p className="text-lg text-gray-700">
          {t('headings.finalAccuracy', 'Final Accuracy: {{accuracy}}%', { accuracy })}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <button
          onClick={handleRestartClick}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg font-semibold shadow-lg transition-all duration-200"
        >
          {t('buttons.practiceAgain', 'Practice Again')}
        </button>
        <button
          onClick={handleStartNewClick}
          className="px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 text-lg font-semibold shadow-lg transition-all duration-200"
        >
          {t('buttons.startNewPractice', 'Start New Practice')}
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;

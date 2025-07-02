import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type PracticeMode = 'auto' | 'english' | 'pinyin';

interface StartScreenProps {
  onStart: (prompt: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setError(t('errors.pleaseEnterSomeText', 'Please enter some text to practice.'));
      return;
    }
    
    if (trimmedPrompt.length < 3) {
      setError(t('errors.pleaseEnterAtLeast3Characters', 'Please enter at least 3 characters.'));
      return;
    }

    // Clear error and start practice
    setError('');
    if (typeof onStart === 'function') {
      onStart(trimmedPrompt);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (error) {
      setError('');
    }
  };

  // Disable button if there's no meaningful content (empty or whitespace-only)
  const isButtonDisabled = prompt.trim().length === 0;

  return (
    <div className="text-center space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={handleInputChange}
            placeholder={t('placeholders.enterTextToPractice')}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-lg"
            rows={4}
            maxLength={500}
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          disabled={isButtonDisabled}
        >
          {t('buttons.startPractice')}
        </button>
      </form>
    </div>
  );
};

export default StartScreen;

import React, { useState } from 'react';
import { isPinyinPracticeText } from '../utils/pinyinUtils';

export type PracticeMode = 'auto' | 'english' | 'pinyin';

interface StartScreenProps {
  onStart: (prompt: string, mode: PracticeMode) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('auto');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setError('Please enter some text to practice with.');
      return;
    }
    
    if (trimmedPrompt.length < 3) {
      setError('Please enter at least 3 characters.');
      return;
    }

    // Determine practice mode
    let finalMode = practiceMode;
    if (practiceMode === 'auto') {
      finalMode = isPinyinPracticeText(trimmedPrompt) ? 'pinyin' : 'english';
    }

    // Clear error and start practice
    setError('');
    if (typeof onStart === 'function') {
      onStart(trimmedPrompt, finalMode);
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
            placeholder="Enter the text you want to practice typing..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-lg"
            rows={4}
            maxLength={500}
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Practice Mode Selection */}
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Practice Mode
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="auto"
                checked={practiceMode === 'auto'}
                onChange={(e) => setPracticeMode(e.target.value as PracticeMode)}
                className="mr-2"
              />
              <span className="text-sm">Auto-detect (Recommended)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="english"
                checked={practiceMode === 'english'}
                onChange={(e) => setPracticeMode(e.target.value as PracticeMode)}
                className="mr-2"
              />
              <span className="text-sm">English typing</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="pinyin"
                checked={practiceMode === 'pinyin'}
                onChange={(e) => setPracticeMode(e.target.value as PracticeMode)}
                className="mr-2"
              />
              <span className="text-sm">Chinese pinyin typing</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Auto-detect will choose pinyin mode for Chinese characters and English mode for other text.
          </p>
        </div>
        
        <button
          type="submit"
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          disabled={isButtonDisabled}
        >
          Start Practice
        </button>
      </form>
    </div>
  );
};

export default StartScreen;

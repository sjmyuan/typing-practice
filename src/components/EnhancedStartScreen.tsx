import { useState } from 'react';
import PoemBrowser from './PoemBrowser';

interface EnhancedStartScreenProps {
  onStart: (prompt: string) => void;
}

type ScreenMode = 'selection' | 'custom' | 'browse';

const EnhancedStartScreen: React.FC<EnhancedStartScreenProps> = ({ onStart }) => {
  const [mode, setMode] = useState<ScreenMode>('selection');
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleCustomSubmit = (e: React.FormEvent) => {
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

    // Clear error and start practice
    setError('');
    onStart(trimmedPrompt);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleModeSelect = (selectedMode: ScreenMode) => {
    setMode(selectedMode);
  };

  const handleBackToSelection = () => {
    setMode('selection');
  };

  const handlePracticeStart = (text: string) => {
    onStart(text);
  };

  // Disable button if there's no meaningful content (empty or whitespace-only)
  const isButtonDisabled = prompt.trim().length === 0;

  if (mode === 'selection') {
    return (
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Choose Practice Mode</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => handleModeSelect('custom')}
            className="p-8 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 group"
          >
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">✏️</div>
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                Create Your Own Content
              </h2>
              <p className="text-gray-600">
                Type or paste your own text to practice with
              </p>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => handleModeSelect('browse')}
            className="p-8 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 group"
          >
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                Browse Existing Poems
              </h2>
              <p className="text-gray-600">
                Choose from a collection of Tang poetry
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'custom') {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Your Practice Text</h2>
        
        <form onSubmit={handleCustomSubmit} className="space-y-4">
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="submit"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              disabled={isButtonDisabled}
            >
              Start Practice
            </button>
            
            <button
              type="button"
              onClick={handleBackToSelection}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            >
              ← Back to Options
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (mode === 'browse') {
    return (
      <PoemBrowser
        onStart={handlePracticeStart}
        onBack={handleBackToSelection}
      />
    );
  }

  return null;
};

export default EnhancedStartScreen;

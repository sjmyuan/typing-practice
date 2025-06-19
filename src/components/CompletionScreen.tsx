import React from 'react';

interface CompletionScreenProps {
  accuracy: number;
  onRestart: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ accuracy, onRestart }) => {
  const handleClick = () => {
    if (typeof onRestart === 'function') {
      onRestart();
    }
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-green-600 mb-2">Practice Complete!</h3>
        <p className="text-lg text-gray-700">
          Final Accuracy: {accuracy}%
        </p>
      </div>
      <button
        onClick={handleClick}
        className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg font-semibold shadow-lg transition-all duration-200"
      >
        Practice Again
      </button>
    </div>
  );
};

export default CompletionScreen;

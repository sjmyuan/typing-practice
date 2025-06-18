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
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg font-medium"
      >
        Practice Again
      </button>
    </div>
  );
};

export default CompletionScreen;

import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const handleClick = () => {
    if (typeof onStart === 'function') {
      onStart();
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-medium"
      >
        Start Practice
      </button>
    </div>
  );
};

export default StartScreen;

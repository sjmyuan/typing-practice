import React from 'react';

interface FontSizeControlProps {
  onIncrease: () => void;
  onDecrease: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({
  onIncrease,
  onDecrease,
  canIncrease,
  canDecrease,
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        type="button"
        onClick={onDecrease}
        disabled={!canDecrease}
        aria-label="Decrease font size"
        className="flex items-center justify-center w-12 h-12 text-lg font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        A-
      </button>
      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        aria-label="Increase font size"
        className="flex items-center justify-center w-12 h-12 text-lg font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        A+
      </button>
    </div>
  );
};

export default FontSizeControl;

import React from 'react';
import { Minus, Plus } from 'lucide-react';

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
    <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
      <button
        type="button"
        onClick={onDecrease}
        disabled={!canDecrease}
        aria-label="Decrease font size"
        className={`
          px-3 py-2 rounded-md text-sm font-medium transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          ${!canDecrease
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
          }
        `}
      >
        <Minus size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        aria-label="Increase font size"
        className={`
          px-3 py-2 rounded-md text-sm font-medium transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          ${!canIncrease
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
          }
        `}
      >
        <Plus size={18} aria-hidden="true" />
      </button>
    </div>
  );
};

export default FontSizeControl;

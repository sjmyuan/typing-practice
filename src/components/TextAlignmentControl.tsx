import React from 'react';

type TextAlignment = 'left' | 'center' | 'right' | 'justify';

interface TextAlignmentControlProps {
  currentAlignment: TextAlignment;
  onAlignmentChange: (alignment: TextAlignment) => void;
}

const TextAlignmentControl: React.FC<TextAlignmentControlProps> = ({
  currentAlignment,
  onAlignmentChange,
}) => {
  const alignmentOptions: { value: TextAlignment; label: string; icon: string }[] = [
    { value: 'left', label: 'Align Left', icon: '⬅️' },
    { value: 'center', label: 'Align Center', icon: '↔️' },
    { value: 'right', label: 'Align Right', icon: '➡️' },
    { value: 'justify', label: 'Justify', icon: '⬌' },
  ];

  const handleAlignmentClick = (alignment: TextAlignment, event: React.MouseEvent<HTMLButtonElement>) => {
    if (alignment !== currentAlignment) {
      onAlignmentChange(alignment);
    }
    // Maintain focus on the clicked button
    event.currentTarget.focus();
  };

  return (
    <div className="flex space-x-1 border border-gray-300 rounded-lg p-1">
      {alignmentOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.label}
          aria-pressed={currentAlignment === option.value}
          onClick={(event) => handleAlignmentClick(option.value, event)}
          className={`
            px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${
              currentAlignment === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <span className="sr-only">{option.label}</span>
          {option.icon}
        </button>
      ))}
    </div>
  );
};

export default TextAlignmentControl;

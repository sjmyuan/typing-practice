import React from 'react';

type CharacterAlignment = 'left' | 'center' | 'right' | 'justify';

interface CharacterAlignmentControlProps {
  currentAlignment: CharacterAlignment;
  onAlignmentChange: (alignment: CharacterAlignment) => void;
}

const CharacterAlignmentControl: React.FC<CharacterAlignmentControlProps> = ({
  currentAlignment,
  onAlignmentChange
}) => {
  const alignmentOptions: { value: CharacterAlignment; label: string; icon: string }[] = [
    { value: 'left', label: 'Left align characters', icon: '⫷' },
    { value: 'center', label: 'Center characters', icon: '⫶' },
    { value: 'right', label: 'Right align characters', icon: '⫸' },
    { value: 'justify', label: 'Justify characters', icon: '⫹' }
  ];

  return (
    <div 
      className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1"
      role="radiogroup"
      aria-label="Character alignment options"
    >
      {alignmentOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onAlignmentChange(option.value)}
          className={`
            px-3 py-2 rounded-md text-sm font-medium transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            ${currentAlignment === option.value
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }
          `}
          aria-label={option.label}
          aria-pressed={currentAlignment === option.value}
          role="radio"
          aria-checked={currentAlignment === option.value}
        >
          <span className="text-lg" aria-hidden="true">{option.icon}</span>
        </button>
      ))}
    </div>
  );
};

export { type CharacterAlignment };
export default CharacterAlignmentControl;

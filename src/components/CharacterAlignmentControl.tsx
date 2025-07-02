import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

type CharacterAlignment = 'left' | 'center' | 'right' | 'justify';

interface CharacterAlignmentControlProps {
  currentAlignment: CharacterAlignment;
  onAlignmentChange: (alignment: CharacterAlignment) => void;
}

const CharacterAlignmentControl: React.FC<CharacterAlignmentControlProps> = ({
  currentAlignment,
  onAlignmentChange
}) => {
  const { t } = useTranslation();
  const alignmentOptions: { value: CharacterAlignment; labelKey: string; Icon: React.ComponentType<{ size?: number }> }[] = [
    { value: 'left', labelKey: 'labels.leftAlignCharacters', Icon: AlignLeft },
    { value: 'center', labelKey: 'labels.centerCharacters', Icon: AlignCenter },
    { value: 'right', labelKey: 'labels.rightAlignCharacters', Icon: AlignRight },
    { value: 'justify', labelKey: 'labels.justifyCharacters', Icon: AlignJustify }
  ];

  return (
    <div 
      className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1"
      role="radiogroup"
      aria-label={t('labels.characterAlignmentOptions')}
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
          aria-label={t(option.labelKey)}
          aria-pressed={currentAlignment === option.value}
          role="radio"
          aria-checked={currentAlignment === option.value}
        >
          <option.Icon size={18} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
};

export { type CharacterAlignment };
export default CharacterAlignmentControl;

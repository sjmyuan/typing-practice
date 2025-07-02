import React from 'react';
import { useTranslation } from 'react-i18next';
import { Maximize, Minimize } from 'lucide-react';

interface FullscreenControlProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

const FullscreenControl: React.FC<FullscreenControlProps> = ({ isFullscreen, onToggle }) => {
  const { t } = useTranslation();
  
  return (
    <button
      type="button"
      onClick={onToggle}
      className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded transition-colors"
      aria-label={isFullscreen ? t('fullscreen.exitFullscreen') : t('fullscreen.enterFullscreen')}
    >
      {isFullscreen ? (
        <Minimize className="w-5 h-5" />
      ) : (
        <Maximize className="w-5 h-5" />
      )}
    </button>
  );
};

export default FullscreenControl;

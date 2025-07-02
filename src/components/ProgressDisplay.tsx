import React from 'react';
import { useTranslation } from 'react-i18next';

interface ProgressDisplayProps {
  typedCount: number;
  totalCount: number;
  correctCount: number;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  typedCount,
  totalCount,
  correctCount
}) => {
  const { t } = useTranslation();
  
  // Handle edge cases for typed count
  const safeTypedCount = Math.max(0, typedCount);
  
  return (
    <div className="mt-4 text-sm text-gray-600">
      <p>
        {t('progress.progressLabel')}: {t('progress.charactersTyped', { typedCount, totalCount })}
        {safeTypedCount > 0 && (
          <span className="ml-4">
            {t('progress.accuracy', { percentage: Math.round((correctCount / typedCount) * 100) })}
          </span>
        )}
      </p>
    </div>
  );
};

export default ProgressDisplay;

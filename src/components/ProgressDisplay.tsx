import React from 'react';

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
  // Handle edge cases for typed count
  const safeTypedCount = Math.max(0, typedCount);
  
  return (
    <div className="mt-4 text-sm text-gray-600">
      <p>
        Progress: {typedCount}/{totalCount} characters
        {safeTypedCount > 0 && (
          <span className="ml-4">
            Accuracy: {Math.round((correctCount / typedCount) * 100)}%
          </span>
        )}
      </p>
    </div>
  );
};

export default ProgressDisplay;

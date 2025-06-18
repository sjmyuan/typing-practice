import React from 'react';

interface TypingCursorProps {
  visible: boolean;
}

const TypingCursor: React.FC<TypingCursorProps> = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <span
      data-testid="cursor"
      className="absolute top-0 left-0 animate-pulse bg-blue-500 w-0.5 h-full shadow-lg"
      style={{
        animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}
      aria-hidden="true"
    />
  );
};

export default TypingCursor;

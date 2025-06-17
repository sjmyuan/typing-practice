import React, { useState, useEffect, useRef } from 'react';

interface PracticeAreaProps {
  prompt: string;
}

const PracticeArea: React.FC<PracticeAreaProps> = ({ prompt }) => {
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault(); // Prevent default browser behavior
    
    if (e.key === 'Backspace') {
      setInput(prev => prev.slice(0, -1));
    } else if (e.key.length === 1 && input.length < prompt.length) {
      // Only accept single character keys and don't exceed prompt length
      setInput(prev => prev + e.key);
    }
  };

  // Auto-focus the container when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Handle clicking to focus
  const handleClick = () => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        ref={containerRef}
        role="textbox"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className="outline-none focus:ring-2 focus:ring-blue-400 rounded p-4 cursor-text bg-gray-50 focus:bg-white transition-colors"
        aria-label="practice area - click here and start typing"
      >
        <div
          className="flex flex-wrap gap-1 text-2xl font-mono select-none leading-relaxed"
          aria-label="practice prompt"
          role="presentation"
        >
          {prompt.split('').map((char, idx) => {
            const isCurrentPosition = idx === input.length;
            let className = 'relative inline-block min-w-[0.5rem]';
            
            if (input[idx] === undefined) {
              className += ' text-gray-400';
            } else if (input[idx] === char) {
              className += ' text-green-600 font-bold bg-green-100 rounded px-1';
            } else {
              className += ' text-red-600 font-bold bg-red-100 rounded px-1';
            }

            return (
              <span
                key={idx}
                data-testid="practice-char"
                className={className}
                aria-label={
                  input[idx] === undefined
                    ? 'untyped'
                    : input[idx] === char
                    ? 'correct'
                    : 'incorrect'
                }
              >
                {char === ' ' ? '\u00A0' : char}
                {isCurrentPosition && (
                  <span
                    data-testid="cursor"
                    className="absolute top-0 left-0 animate-pulse bg-blue-500 w-0.5 h-full"
                    aria-hidden="true"
                  />
                )}
              </span>
            );
          })}
          {input.length === prompt.length && (
            <span className="text-green-600 font-bold ml-2">✓ Complete!</span>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {input.length === 0 ? (
            <p>Click here and start typing to begin practice</p>
          ) : (
            <p>
              Progress: {input.length}/{prompt.length} characters
              {input.length > 0 && (
                <span className="ml-4">
                  Accuracy: {Math.round((input.split('').filter((char, idx) => char === prompt[idx]).length / input.length) * 100)}%
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeArea;

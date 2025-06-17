import React, { useState } from 'react';

interface PracticeAreaProps {
  prompt: string;
}

const PracticeArea: React.FC<PracticeAreaProps> = ({ prompt }) => {
  const [input, setInput] = useState('');

  // Handle input changes, only allow up to prompt length
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= prompt.length) {
      setInput(value);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <label htmlFor="practice-input" className="block mb-2 font-semibold">
        Type the text below:
      </label>
      <input
        id="practice-input"
        type="text"
        aria-label="practice input"
        value={input}
        onChange={handleChange}
        autoComplete="off"
        className="mb-4 border rounded px-2 py-1 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        spellCheck={false}
      />
      <div
        className="flex gap-1 text-lg font-mono select-none"
        aria-label="practice prompt"
        role="presentation"
      >
        {prompt.split('').map((char, idx) => {
          let className = '';
          if (input[idx] === undefined) {
            className = '';
          } else if (input[idx] === char) {
            className = 'text-green-600 font-bold';
          } else {
            className = 'text-red-600 font-bold';
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
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default PracticeArea;

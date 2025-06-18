import React, { useState } from 'react';
import StartScreen from './StartScreen';
import TypingArea from './TypingArea';
import CompletionScreen from './CompletionScreen';

interface PracticeAreaProps {
  prompt: string;
}

// Practice state types
type PracticeState = 'ready' | 'active' | 'completed';

interface CompletionStats {
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
}

const PracticeArea: React.FC<PracticeAreaProps> = ({ prompt }) => {
  const [practiceState, setPracticeState] = useState<PracticeState>('ready');
  const [completionStats, setCompletionStats] = useState<CompletionStats | null>(null);

  // State transition functions
  const startPractice = () => {
    setPracticeState('active');
  };

  const completePractice = (stats: CompletionStats) => {
    setCompletionStats(stats);
    setPracticeState('completed');
  };

  const restartPractice = () => {
    setPracticeState('ready');
    setCompletionStats(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {practiceState === 'ready' && (
        <StartScreen onStart={startPractice} />
      )}
      
      {practiceState === 'active' && (
        <TypingArea 
          prompt={prompt}
          onComplete={completePractice}
        />
      )}
      
      {practiceState === 'completed' && completionStats && (
        <CompletionScreen 
          accuracy={completionStats.accuracy}
          onRestart={restartPractice}
        />
      )}
    </div>
  );
};

export default PracticeArea;

import React, { useState, useEffect } from 'react';
import StartScreen from './StartScreen';
import TypingArea from './TypingArea';
import CompletionScreen from './CompletionScreen';

interface PracticeAreaProps {
  initialPrompt?: string;
  onPracticeStateChange?: (state: PracticeState) => void;
}

// Practice state types
export type PracticeState = 'ready' | 'active' | 'completed';

interface CompletionStats {
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
}

const PracticeArea: React.FC<PracticeAreaProps> = ({ 
  initialPrompt = '', 
  onPracticeStateChange 
}) => {
  const [practiceState, setPracticeState] = useState<PracticeState>('ready');
  const [currentPrompt, setCurrentPrompt] = useState<string>(initialPrompt);
  const [completionStats, setCompletionStats] = useState<CompletionStats | null>(null);

  // Notify parent component of practice state changes
  useEffect(() => {
    if (typeof onPracticeStateChange === 'function') {
      onPracticeStateChange(practiceState);
    }
  }, [practiceState, onPracticeStateChange]);

  // State transition functions
  const startPractice = (prompt: string) => {
    setCurrentPrompt(prompt);
    setPracticeState('active');
  };

  const completePractice = (stats: CompletionStats) => {
    setCompletionStats(stats);
    setPracticeState('completed');
  };

  // Restart practice by returning to start screen and clearing prompt
  const restartPractice = () => {
    setPracticeState('ready');
    setCompletionStats(null);
    setCurrentPrompt(initialPrompt);
  };

  // Repeat practice with same prompt by going directly to practice area
  const repeatPractice = () => {
    setPracticeState('active');
    setCompletionStats(null);
  };

  // Notify parent component about practice state changes
  useEffect(() => {
    if (typeof onPracticeStateChange === 'function') {
      onPracticeStateChange(practiceState);
    }
  }, [practiceState, onPracticeStateChange]);

  return (
    <div className="w-full max-w-[2048px] mx-auto">
      {practiceState === 'ready' && (
        <StartScreen onStart={startPractice} />
      )}
      
      {practiceState === 'active' && currentPrompt && (
        <TypingArea 
          prompt={currentPrompt}
          onComplete={completePractice}
        />
      )}
      
      {practiceState === 'completed' && completionStats && (
        <CompletionScreen 
          accuracy={completionStats.accuracy}
          onRestart={repeatPractice}
          onStartNew={restartPractice}
        />
      )}
    </div>
  );
};

export default PracticeArea;

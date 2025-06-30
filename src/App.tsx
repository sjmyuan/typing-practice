import { useState } from 'react'
import './App.css'
import PracticeArea, { type PracticeState } from './components/PracticeArea'

function App() {
  const [practiceState, setPracticeState] = useState<PracticeState>('ready');

  const handlePracticeStateChange = (state: PracticeState) => {
    setPracticeState(state);
  };

  // Determine header size based on practice state
  const isMinimized = practiceState === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex flex-col">
        <header 
          className={`text-center flex-shrink-0 transition-all duration-300 ${
            isMinimized ? 'mb-2' : 'mb-8'
          }`}
          role="banner"
          data-practice-state={practiceState}
        >
          <div className={`bg-white rounded-3xl shadow-lg mx-auto max-w-2xl border-4 border-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ${
            isMinimized ? 'p-3 mb-2' : 'p-6 mb-6'
          }`}>
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/typing-practice.svg" 
                alt="Typing Practice Icon" 
                className={`mr-3 transition-all duration-300 ${
                  isMinimized ? 'w-8 h-8' : 'w-12 h-12'
                }`}
              />
              <h1 className={`font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${
                isMinimized ? 'text-2xl' : 'text-4xl'
              }`}>
                Typing Adventure
              </h1>
              <div className={`ml-3 transition-all duration-300 ${
                isMinimized ? 'text-2xl' : 'text-4xl'
              }`}>🚀</div>
            </div>
            {!isMinimized && (
              <>
                <p className="text-lg text-gray-700 font-medium mb-2">
                  Let's learn to type together! 
                </p>
                <p className="text-base text-blue-600 font-semibold">
                  🌟 Practice • Learn • Have Fun! 🌟
                </p>
              </>
            )}
          </div>
        </header>
        
        <main className="flex flex-col">
          <PracticeArea onPracticeStateChange={handlePracticeStateChange} />
        </main>
      </div>
    </div>
  )
}

export default App

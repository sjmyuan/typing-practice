import './App.css'
import PracticeArea from './components/PracticeArea'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Typing Practice
          </h1>
          <p className="text-gray-600 text-sm">
            Improve your typing skills with custom text
          </p>
        </header>
        
        <main>
          <PracticeArea />
        </main>
      </div>
    </div>
  )
}

export default App

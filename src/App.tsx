import './App.css'
import PracticeArea from './components/PracticeArea'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex flex-col">
        <header className="text-center mb-8 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 mx-auto max-w-2xl border-4 border-gradient-to-r from-blue-400 to-purple-400">
            <div className="flex items-center justify-center mb-4">
              <div className="text-4xl mr-3">⌨️</div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Typing Adventure
              </h1>
              <div className="text-4xl ml-3">🚀</div>
            </div>
            <p className="text-lg text-gray-700 font-medium mb-2">
              Let's learn to type together! 
            </p>
            <p className="text-base text-blue-600 font-semibold">
              🌟 Practice • Learn • Have Fun! 🌟
            </p>
          </div>
        </header>
        
        <main className="flex flex-col">
          <PracticeArea />
        </main>
      </div>
    </div>
  )
}

export default App

import type { TangPoem } from '../utils/tangPoemsUtils';

interface ContentPreviewProps {
  poem: TangPoem;
  onStart: (text: string) => void;
  onBack: () => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ poem, onStart, onBack }) => {
  const handleStart = () => {
    const fullText = `${poem.title}\n${poem.author}\n${poem.text}`;
    onStart(fullText);
  };

  // Split text by line breaks for proper display
  const lines = poem.text.split('\n').filter(line => line.trim());

  return (
    <div className="text-center space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">{poem.title}</h2>
        <p className="text-lg text-gray-600">by {poem.author}</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
        <div className="space-y-3 text-lg leading-relaxed text-gray-800">
          {lines.map((line, index) => (
            <div key={index} className="text-center">
              {line}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={handleStart}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg font-semibold shadow-lg transition-all duration-200"
        >
          Start Practice
        </button>
        
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
        >
          ← Back to Titles
        </button>
      </div>
    </div>
  );
};

export default ContentPreview;

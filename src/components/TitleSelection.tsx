interface TitleSelectionProps {
  author: string;
  titles: string[];
  onSelect: (title: string) => void;
  onBack: () => void;
}

const TitleSelection: React.FC<TitleSelectionProps> = ({ author, titles, onSelect, onBack }) => {
  if (titles.length === 0) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Select Title by {author}</h2>
        <p className="text-gray-600">Loading titles...</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
        >
          ← Back to Authors
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Select Title by {author}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {titles.map((title) => (
          <button
            key={title}
            type="button"
            onClick={() => onSelect(title)}
            className="px-6 py-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 text-lg font-medium text-gray-800 text-left"
          >
            {title}
          </button>
        ))}
      </div>
      
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
      >
        ← Back to Authors
      </button>
    </div>
  );
};

export default TitleSelection;

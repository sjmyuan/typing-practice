# 🎯 Typing Practice

<div align="center">
  <img src="public/typing-practice.svg" alt="Typing Practice Logo" width="120" height="120">
  
  **🌐 Live Demo: [typing.shangjiaming.com](https://typing.shangjiaming.com)**
</div>

A modern, accessible typing practice web application designed for elementary school students (grades 1-3) to improve typing speed, accuracy, and confidence in both English and Chinese. Features customizable content, real-time feedback, and comprehensive progress tracking.

## ✨ Features

### 🎓 Student-Focused Learning
- **Real-time Feedback**: Incorrect characters marked in red, correct ones in green
- **Adaptive Cursor**: Visual cursor pointing to the next character
- **Dual Language Support**: Practice typing in both English and Chinese
- **Pinyin Support**: Chinese characters display pinyin for pronunciation guidance
- **Auto-detection**: Automatically switches between English and Pinyin modes

### 🎨 Accessibility & Customization
- **Font Size Control**: 4 adjustable font sizes (small, medium, large, extra-large)
- **Character Alignment**: Left, center, right, and justify alignment options
- **Fullscreen Mode**: Distraction-free typing environment
- **High Contrast**: Improved visibility for all students
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 👨‍👩‍👧‍👦 Parent Controls
- **Custom Content**: Parents can create personalized practice sessions
- **Poem Library**: Pre-loaded Chinese Tang poems for cultural learning
- **Local Storage**: All data saved locally - no accounts needed

### 🛠️ Technical Features
- **Cross-platform**: Web-based application running in any modern browser
- **Offline Capable**: Works without internet connection after initial load
- **No Account System**: Privacy-focused with local data storage only
- **Comprehensive Testing**: 100+ unit tests ensuring reliability

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd typing-practice

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run lint         # Run linter
npm run storybook    # Start Storybook for component development
```

## 🏗️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS v4 with utility-first approach
- **Internationalization**: i18next for English/Chinese language support
- **Icons**: Lucide React for consistent iconography
- **Testing**: Vitest with React Testing Library
- **Documentation**: Storybook for component showcase
- **Chinese Support**: pinyin-pro library for accurate pinyin conversion

## 📱 Usage

### For Students
1. **Choose Practice Mode**: Select from pre-loaded poems or custom content
2. **Start Typing**: Characters appear with visual feedback as you type
3. **Get Feedback**: See correct (green) and incorrect (red) characters instantly
4. **Track Progress**: View accuracy and speed statistics after each session

### For Parents
1. **Customize Content**: Click "Create Your Own Content" to add personalized text
2. **Browse Poems**: Explore the Tang poetry collection for cultural learning
3. **Adjust Settings**: Modify font size, alignment, and other preferences

## 🎯 Core Components

- **TypingArea**: Main typing interface with real-time feedback
- **PinyinCharacterDisplay**: Specialized component for Chinese character input
- **PracticeArea**: Orchestrates the entire practice session flow
- **ProgressDisplay**: Shows typing statistics and progress
- **PoemBrowser**: Browse and select from pre-loaded Chinese poems
- **FontSizeControl**: Adjustable font sizes for better accessibility
- **CharacterAlignmentControl**: Text alignment options for readability
- **LanguageSwitcher**: Switch between English and Chinese interface

## 🧪 Testing

The project includes comprehensive testing coverage:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📚 Storybook

Explore components in isolation:

```bash
npm run storybook
```

Visit http://localhost:6006 to view the component library.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── TypingArea.tsx  # Main typing interface
│   ├── PracticeArea.tsx # Practice session orchestration
│   └── ...             # Other components
├── i18n/               # Internationalization setup
├── utils/              # Utility functions (pinyin, etc.)
└── assets/             # Static assets
```

## 🔧 Configuration

### Local Storage Keys
- `typingPracticeFontSize`: Font size preference
- `typingPracticeCharacterAlignment`: Text alignment preference
- `typingPracticeTextAlignment`: Legacy alignment support

### Environment Variables
No environment variables required - the app runs entirely client-side.

## 🎨 Design Philosophy

- **Child-Friendly**: Clean, intuitive interface designed for young learners
- **Accessibility First**: High contrast, large fonts, keyboard navigation
- **Privacy Focused**: No data collection, everything stored locally
- **Progressive Enhancement**: Works on any device, enhanced on modern browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Chinese Tang poetry collection for cultural learning content
- Pinyin-pro library for accurate Chinese character conversion
- Tailwind CSS for beautiful, responsive styling
- React and TypeScript communities for excellent tooling
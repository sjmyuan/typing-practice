### Typing Practice Program

The typing practice program will have the following core features:

1. **Target Users**: Elementary school students.
2. **Core Features**:
   - Clean and modern interface design.
   - Real-time feedback: Incorrect characters marked in red, correct characters marked in green, and a cursor pointing to the next character.
   - Display accuracy and speed statistics after each practice session.
   - Parents can customize practice content.
   - Parents can view students' accuracy trends, speed changes, and common error words.
   - Supports both English and Chinese practice, with pinyin displayed for Chinese exercises.
3. **Technical Implementation**:
   - Cross-platform web application, purely front-end.
   - Data stored locally in the browser (LocalStorage), with JSON format import/export support.
4. **Additional Features**:
   - No account system, no gamification elements.
   - Supports both English and Chinese languages.

---

### Detailed Action Plan

1. **Interface Design**:
   - Design a clean and modern interface, including a typing area and parent function entry.
   - Ensure the interface displays well on different devices (computer, tablet, phone).

2. **Core Feature Development**:
   - **Real-time Feedback**:
     - Implement incorrect character marking (red) and correct character marking (green).
     - Add a cursor pointing to the next character.
   - **Pinyin Display**:
     - Display pinyin in the typing area during Chinese practice and only check the characters, not the tones when typing.
     - Use a pinyin library (e.g., `pinyin.js`) to convert Chinese characters to pinyin.
   - **Data Statistics**:
     - Display accuracy and speed statistics after each practice session.
     - Record and display accuracy trends, speed changes, and common error words.
   - **Parent Functions**:
     - Develop the ability for parents to customize practice content.
     - Implement data import/export functionality (JSON format).

3. **Technical Implementation**:
   - Use React, TypeScript and Tailwind CSS for front-end development.
   - Use `LocalStorage` to store practice data.
   - Use a pinyin library (e.g., `pinyin.js`) for Chinese pinyin display.
   - Ensure cross-browser compatibility (Chrome, Firefox, Safari, etc.).

4. **Testing and Optimization**:
   - Test compatibility across different devices and browsers.
   - Optimize pinyin display and feedback mechanisms.
   - Test data import/export functionality to ensure data integrity and ease of use.

5. **User Testing**:
   - Invite elementary school students and parents to test the program and provide feedback.
   - Adjust interface design and functionality based on feedback.

---

### Example Workflow

1. **Chinese Practice**:
   - Parents import a Chinese text (e.g., “我喜欢学习”).
   - The program displays pinyin (e.g., “wǒ xǐhuān xuéxí”).
   - Students type while receiving real-time feedback on correctness.
   - After practice, accuracy and speed statistics are displayed.

2. **English Practice**:
   - Parents import an English text (e.g., “I love learning”).
   - Students type directly, with real-time feedback on correctness.
   - After practice, accuracy and speed statistics are displayed.
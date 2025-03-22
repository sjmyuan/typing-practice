## Project: Typing Practice Program

### Project Description  
A typing practice program designed for younger elementary school students (grades 1–3) to improve typing speed, accuracy, and confidence in both English and Chinese. Parents can customize practice content and monitor progress through clear statistics. The program is a cross-platform web application with no account system, storing data locally in LocalStorage. Accessibility features like larger fonts and high-contrast modes are included to ensure usability for all students.

---

## Personas  

### Persona 1: **Elementary School Student**  
- **Description**: A younger elementary school student (grades 1–3) who is a complete beginner at typing.  
- **Goals**:  
  - Improve typing speed and accuracy over time.  
  - Learn proper finger placement on the keyboard.  
  - Gain confidence in typing both English and Chinese characters.  
- **Pain Points**:  
  - Difficulty staying focused during practice sessions.  
  - Struggling with correct finger placement or hand coordination.  
  - Frustration with errors or lack of progress.  
- **Needs**:  
  - Real-time feedback to correct mistakes.  
  - A clean and modern interface to maintain engagement.  
  - Accessibility features like larger fonts and high-contrast modes.  

### Persona 2: **Parent**  
- **Description**: A parent of an elementary school student who requires a simple and intuitive interface for customization and monitoring.  
- **Goals**:  
  - Ensure their children practice typing regularly.  
  - Monitor progress and identify areas for improvement.  
  - Have a tool that requires minimal setup and maintenance.  
- **Pain Points**:  
  - Difficulty finding suitable typing tools for younger students.  
  - Lack of time to supervise practice sessions.  
  - Uncertainty about how to track progress effectively.  
- **Needs**:  
  - Ability to customize practice content easily.  
  - Clear tabular data to monitor accuracy trends, speed changes, and common error words.  
  - Data safety features like JSON import/export and warnings about LocalStorage persistence.  

---

## Epics  

### Epic 1: **Student Typing Practice**  
_Students want to practice typing so that they can improve speed, accuracy, and confidence._  

#### User Stories:  

1. **As a student**, I want to see incorrect characters marked in red and correct characters marked in green so that I can immediately identify my mistakes.  
   - **Acceptance Criteria**:  
     - Given the student is typing in the practice area,  
       When they type a correct character,  
       Then the character should be marked in green.  
     - Given the student is typing in the practice area,  
       When they type an incorrect character,  
       Then the character should be marked in red.  
     - Given the student has typed some characters,  
       When they use the backspace key to correct a mistake,  
       Then the previously marked characters should update in real-time (e.g., red markings removed if corrected).  
     - Given the student skips characters by moving the cursor,  
       When they resume typing,  
       Then the program should continue marking characters correctly based on their input.  
     - Given the student types very quickly,  
       When the program processes their input,  
       Then the feedback (red/green markings) should remain accurate and responsive.  

2. **As a student**, I want a cursor pointing to the next character so that I know where to focus while typing.  
   - **Acceptance Criteria**:  
     - Given the student is typing in the practice area,  
       When they type a character,  
       Then the cursor should move to the next character in the sequence.  
     - Given the student uses the backspace key,  
       When they correct a mistake,  
       Then the cursor should return to the previous character and remain visually distinct.  
     - Given the student skips characters by moving the cursor manually,  
       When they resume typing,  
       Then the cursor should correctly indicate the next character to type.  
     - Given the student types a character different from the one under the cursor,  
       When the mismatch occurs,  
       Then the program should display an error (e.g., marking the incorrect character in red).  
     - Given the program is running on any device or browser,  
       When the cursor is displayed,  
       Then it should be visually distinct (e.g., bolded or highlighted) to ensure it’s easy to spot.  

3. **As a student**, I want to type pinyin during Chinese practice so that I can learn to associate characters with their pronunciation.  
   - **Acceptance Criteria**:  
     - Given the student is practicing Chinese typing,  
       When they see a Chinese character with its corresponding pinyin displayed,  
       Then they should type the pinyin (without tones) to complete the exercise.  
     - Given the student types the correct pinyin (ignoring tones),  
       When they complete the input,  
       Then the program should mark the input as correct and move to the next character.  
     - Given the student types incorrect pinyin (ignoring tones),  
       When the mismatch occurs,  
       Then the program should mark the input as incorrect (e.g., red highlighting).  
     - Given the student skips or backspaces during input,  
       When they resume typing,  
       Then the program should continue validating the pinyin input from the current position.  
     - Given the program runs on any device or browser,  
       When displaying pinyin,  
       Then it should be clear and legible to ensure students can read it easily.  

4. **As a student**, I want to see accuracy and speed statistics after each session so that I can track my progress.  
   - **Acceptance Criteria**:  
     - Given the student completes a typing session,  
       When the session ends,  
       Then the program should display accuracy as a percentage of correct characters typed.  
     - Given the student completes a typing session,  
       When the session ends,  
       Then the program should display speed in characters per minute (CPM).  
     - Given the student completes a typing session,  
       When the statistics are displayed,  
       Then they should appear immediately after the session ends without requiring additional input.  
     - Given the student types very quickly or slowly,  
       When the program calculates speed,  
       Then the CPM calculation should remain accurate regardless of typing pace.  
     - Given the student makes multiple mistakes during a session,  
       When the program calculates accuracy,  
       Then it should correctly reflect the percentage of correct characters typed.  
     - Given the program runs on any device or browser,  
       When displaying statistics,  
       Then the information should be clear, concise, and easy to read.  

5. **As a student**, I want larger fonts and high-contrast modes so that I can comfortably use the program regardless of my visual needs.  
   - **Acceptance Criteria**:  
     - Given the student is using the program,  
       When they toggle the high-contrast mode,  
       Then the interface should switch to a high-contrast color scheme (e.g., dark background with light text).  
     - Given the student is using the program,  
       When they adjust the font size manually,  
       Then the text in the typing area and other key elements should resize accordingly.  
     - Given the student has adjusted font size or enabled high-contrast mode,  
       When they return to the program in a new session,  
       Then their preferences should be remembered and applied automatically.  
     - Given the program runs on different devices (e.g., computer, tablet, phone),  
       When accessibility features are enabled,  
       Then the changes should display correctly and maintain usability across devices.  
     - Given the student disables high-contrast mode or resets font size,  
       When they make the change,  
       Then the program should revert to the default settings immediately.  

---

### Epic 2: **Parent Monitoring and Customization**  
_Parents want to customize practice content and monitor progress so that their children can improve effectively._  

#### User Stories:  

1. **As a parent**, I want to type or paste custom practice content so that I can tailor exercises to my child’s learning needs.  
   - **Acceptance Criteria**:  
     - Given the parent is creating practice content,  
       When they type or paste plain text into the input area,  
       Then the program should accept the input without restrictions on formatting.  
     - Given the parent has entered practice content,  
       When they submit the content,  
       Then the program should validate the input to ensure it contains valid English or Chinese text.  
     - Given the parent submits invalid content (e.g., non-text characters or unsupported languages),  
       When validation fails,  
       Then the program should display an error message prompting the parent to correct the input.  
     - Given the parent submits valid content,  
       When the content is saved,  
       Then it should be immediately available for the student to practice.  
     - Given the program runs on any device or browser,  
       When the parent types or pastes content,  
       Then the input area should handle large amounts of text without performance issues.  

2. **As a parent**, I want the program to validate input text so that only valid English or Chinese content is accepted.  
   - **Acceptance Criteria**:  
     - Given the parent submits practice content,  
       When the content contains mixed-language text (e.g., English and Chinese in the same sentence),  
       Then the program should display an error message indicating that mixed-language content is not allowed.  
     - Given the parent submits practice content,  
       When the content contains excessive special characters or numbers,  
       Then the program should display an error message indicating that such content is not allowed.  
     - Given the parent submits valid English or Chinese text,  
       When the validation passes,  
       Then the content should be saved and made available for practice.  
     - Given the parent submits invalid content,  
       When the validation fails,  
       Then the program should provide clear feedback about the specific issue (e.g., "Mixed-language content detected" or "Excessive special characters").  
     - Given the program runs on any device or browser,  
       When validating input text,  
       Then the process should be fast and responsive, even for longer texts.  

3. **As a parent**, I want to view tabular data showing accuracy trends, speed changes, and common error words so that I can identify areas for improvement.  
   - **Acceptance Criteria**:  
     - Given the parent accesses the progress monitoring section,  
       When they view the tabular data,  
       Then the table should display information from all past practice sessions.  
     - Given the parent views the tabular data,  
       When they examine the table,  
       Then it should include columns for session date, accuracy percentage, speed (in CPM), and a list of common error words.  
     - Given the parent views the tabular data,  
       When they scroll through the table,  
       Then the program should ensure all rows are clearly visible and easy to read, even for large datasets.  
     - Given the parent adds new practice sessions,  
       When the data is updated,  
       Then the table should automatically include the latest session data without requiring manual refresh.  
     - Given the program runs on any device or browser,  
       When displaying the table,  
       Then it should remain responsive and legible, adapting to different screen sizes (e.g., computer, tablet, phone).  

4. **As a parent**, I want to export practice data as a JSON file so that I can back it up externally.  
   - **Acceptance Criteria**:  
     - Given the parent chooses to export practice data,  
       When they initiate the export process,  
       Then the program should generate a JSON file containing all data (e.g., practice content, statistics, error logs).  
     - Given the parent initiates the export process,  
       When the JSON file is generated,  
       Then the program should display a confirmation message (e.g., "Data successfully exported as typing_practice_backup_[date].json").  
     - Given the parent exports practice data,  
       When the JSON file is created,  
       Then it should follow the naming convention "typing_practice_backup_[date].json" (e.g., "typing_practice_backup_2023-10-05.json").  
     - Given the parent views the exported JSON file,  
       When they open it,  
       Then the file should be well-structured and readable, with clear sections for each type of data (e.g., practice content, accuracy trends, common errors).  
     - Given the program runs on any device or browser,  
       When exporting the JSON file,  
       Then the process should complete successfully without errors, even for large datasets.  

5. **As a parent**, I want to receive a warning if LocalStorage is cleared so that I can take steps to prevent data loss.  
   - **Acceptance Criteria**:  
     - Given the program detects that LocalStorage has been cleared,  
       When the user accesses the program,  
       Then a warning message should appear immediately (e.g., "Your practice data has been cleared from this browser. Please back up your data regularly.").  
     - Given the warning message is displayed,  
       When the parent reads it,  
       Then it should include clear instructions on how to recover or back up data (e.g., "You can export your data as a JSON file to avoid losing progress in the future.").  
     - Given the program detects an action that may lead to LocalStorage clearance (if detectable),  
       When the action is initiated,  
       Then the program should prompt the parent to export their data first (e.g., "It seems your browser data may be cleared. Would you like to export your data now?").  
     - Given the parent chooses to export data after receiving the warning,  
       When they initiate the export process,  
       Then the program should allow them to create a JSON backup without requiring additional setup.  
     - Given the program runs on any device or browser,  
       When displaying the warning message,  
       Then it should be clear, concise, and non-intrusive, ensuring it does not disrupt the user experience.  

---

### Epic 3: **Technical Implementation**  
_Developers want to build a cross-platform web application so that the program works seamlessly across devices and browsers._  

#### User Stories:  

1. **As a developer**, I want to use React, TypeScript, and Tailwind CSS so that the program has a modern and responsive design.  
   - **Acceptance Criteria**:  
     - Given the program is accessed on different devices (e.g., computer, tablet, phone),  
       When the interface is displayed,  
       Then it should adapt seamlessly to various screen sizes, ensuring all elements are visible and functional.  
     - Given the program contains multiple pages or components,  
       When navigating between them,  
       Then the interface should maintain consistent styling, fonts, and colors across all sections.  
     - Given the program dynamically updates content (e.g., during typing practice or when parents customize content),  
       When updates occur,  
       Then the layout should remain intact, with no overlapping or misaligned elements.  
     - Given the program runs on any device or browser,  
       When loading the interface,  
       Then it should load quickly and render correctly without requiring manual adjustments.  
     - Given the program is tested for edge cases (e.g., very large text inputs or rapid interactions),  
       When such scenarios occur,  
       Then the interface should remain stable and responsive, handling updates gracefully.  

2. **As a developer**, I want to store practice data in LocalStorage so that it persists locally without requiring an account system.  
   - **Acceptance Criteria**:  
     - Given the student completes a typing session,  
       When the session ends,  
       Then the program should automatically save the session data (e.g., accuracy, speed, errors) to LocalStorage.  
     - Given the program attempts to save data to LocalStorage,  
       When LocalStorage reaches its storage limit,  
       Then the program should display an error message (e.g., "Unable to save data. LocalStorage is full. Please export your data.") and prompt the user to take action.  
     - Given the program saves data to LocalStorage,  
       When the data is retrieved in a new session,  
       Then it should load correctly and be available for use without requiring additional input.  
     - Given the program runs on any device or browser,  
       When saving or retrieving data from LocalStorage,  
       Then the process should complete successfully without errors, ensuring data integrity.  
     - Given the program detects corrupted or missing data in LocalStorage,  
       When the issue is identified,  
       Then the program should notify the user (e.g., "Some data may be missing or corrupted. Please check your backups.") and guide them on next steps.  

3. **As a developer**, I want to ensure cross-browser compatibility so that the program works on Chrome, Firefox, Safari, etc.  
   - **Acceptance Criteria**:  
     - Given the program is accessed on major browsers (Chrome, Firefox, Safari, Edge),  
       When the interface is loaded,  
       Then it should render correctly and function as expected without visual or functional discrepancies.  
     - Given the program runs on different browsers,  
       When browser-specific quirks are encountered (e.g., rendering differences or API inconsistencies),  
       Then the program should handle these issues gracefully, ensuring a seamless user experience.  
     - Given the program is tested on unsupported or outdated browsers,  
       When unsupported features are encountered,  
       Then the program should display a message (e.g., "This browser is not fully supported. Please use a modern browser for the best experience.") rather than attempting to provide fallbacks.  
     - Given the program is updated with new features or changes,  
       When cross-browser testing is performed,  
       Then all major browsers should continue to support the program without requiring additional fixes.  
     - Given the program is tested for edge cases (e.g., rapid interactions or large data inputs),  
       When such scenarios occur,  
       Then the program should remain stable and responsive across all supported browsers.  

---

### Dependencies/Risks  
1. **Dependency**: Integration of a pinyin library (e.g., `pinyin.js`) for Chinese practice.  
2. **Risk**: Ensuring LocalStorage data integrity and handling scenarios where it might be cleared.  
3. **Risk**: Balancing simplicity for parents with robust functionality for monitoring progress.  
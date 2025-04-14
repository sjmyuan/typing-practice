# **Software Architecture Design Document**

## **1. System Architecture**
The system architecture for the Typing Practice is designed to support a cross-platform web application with local data persistence using LocalStorage. It consists of multiple internal modules interacting through well-defined interfaces.

### **1.1 C4 Diagrams**

#### **Context Diagram**
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

Person(student, "Student", "Young elementary school students (grades 1-3)")
Person(parent, "Parent", "Parents of elementary school students")
System(typingPracticeApp, "Typing Practice Web App", "A web application for improving typing skills in English and Chinese")

Rel(student, typingPracticeApp, "Uses")
Rel(parent, typingPracticeApp, "Customizes and Monitors")

System_Ext(browser, "Web Browser", "Any modern web browser")
System_Ext(localStorage, "LocalStorage", "Local storage mechanism within the browser")

Rel(typingPracticeApp, browser, "Runs on")
Rel(typingPracticeApp, localStorage, "Stores data in")
@enduml
```
- External users (students and parents) interact with the system via a web browser.
- The web application stores all data locally using LocalStorage.

#### **Container Diagram**
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(student, "Student")
Person(parent, "Parent")
System_Boundary(typingPracticeApp, "Typing Practice Web App") {
    Container(webApp, "Web Application", "React + TypeScript", "Frontend application handling user interactions")
    ContainerDb(localStorage, "LocalStorage", "Browser's LocalStorage", "Stores practice data, statistics, and configurations")
}

Rel(student, webApp, "Uses")
Rel(parent, webApp, "Customizes and Monitors")
Rel(webApp, localStorage, "Reads from and writes to")
@enduml
```
- **Frontend**: React-based SPA with TypeScript.
- **Data Storage**: LocalStorage for storing practice content, statistics, and configurations.

#### **Component Diagram**
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

Container(webApp, "Web Application", "React + TypeScript", "Handles user interactions and displays content")
Component(typingEngine, "Typing Engine", "JavaScript/TypeScript", "Manages typing practice logic and feedback")
Component(pinyinEngine, "Pinyin Engine", "JavaScript/TypeScript", "Handles pinyin input for Chinese characters")
Component(statisticsModule, "Statistics Module", "JavaScript/TypeScript", "Calculates and displays typing statistics")
Component(localStorageAdapter, "LocalStorage Adapter", "JavaScript/TypeScript", "Interfaces with LocalStorage")

Rel(webApp, typingEngine, "Uses for practice sessions")
Rel(webApp, pinyinEngine, "Uses for Chinese practice")
Rel(webApp, statisticsModule, "Uses for displaying stats")
Rel(webApp, localStorageAdapter, "Uses for data persistence")
Rel(localStorageAdapter, localStorage, "Reads from and writes to")
@enduml
```
- Example: "Typing Engine" contains components like `TypingController`, `FeedbackGenerator`, and `ProgressTracker`.

### **1.2 Component Interaction Flowchart**
```plantuml
@startuml
actor Student
actor Parent
participant "Web Application" as webApp
participant "Typing Engine" as typingEngine
participant "Pinyin Engine" as pinyinEngine
participant "Statistics Module" as statsModule
participant "LocalStorage Adapter" as localStorageAdapter
database "LocalStorage" as localStorage

Student -> webApp: Starts typing practice session
webApp -> typingEngine: Initializes typing session
typingEngine -> localStorageAdapter: Fetches saved practice content
localStorageAdapter -> localStorage: Reads practice content
typingEngine -> typingEngine: Manages typing input and provides real-time feedback
typingEngine -> statsModule: Calculates accuracy and speed
statsModule -> localStorageAdapter: Saves session statistics
localStorageAdapter -> localStorage: Writes session statistics

Parent -> webApp: Customizes practice content
webApp -> localStorageAdapter: Saves custom content
localStorageAdapter -> localStorage: Writes custom content
Parent -> webApp: Views progress statistics
webApp -> localStorageAdapter: Fetches statistics
localStorageAdapter -> localStorage: Reads statistics
webApp -> Parent: Displays statistics
@enduml
```
- A student starts a typing practice session → Typing Engine fetches content and manages input → Feedback is provided in real-time → Statistics are calculated and saved.
- A parent customizes practice content → Content is saved to LocalStorage → Parent views progress statistics → Statistics are fetched and displayed.

---

## **2. Technology Stack**
The technology stack is chosen to align with your preferences for TypeScript, AWS S3 hosting, and scalability requirements.

### **2.1 Programming Languages**
- Frontend: TypeScript (Next.js with client-side rendering).

### **2.2 Frameworks & Libraries**
- Frontend Framework: Next.js with TypeScript and client-side rendering.
- Styling: Tailwind CSS for responsive and utility-first styling.
- Pinyin Support: `pinyin.js` library for handling Chinese pinyin input validation.
- State Management: Context API for managing global state (e.g., practice content, statistics).
- JSON Export: FileSaver.js for exporting practice data as JSON files.

### **2.3 Testing & Quality Assurance**
- Unit Testing: Jest for unit tests.
- Integration Testing: React Testing Library for integration tests.
- End-to-End Testing: Cypress for simulating user interactions across the entire application.

### **2.4 Development & Deployment Tools**
- Version Control: GitHub for version control and collaboration.
- CI/CD Pipeline: GitHub Actions for automated testing and deployment.
- Hosting: AWS S3 + CloudFront for deploying the frontend web application, ensuring fast and reliable hosting with automatic SSL.

---

## **3. Data Model**
The data model is designed to support LocalStorage for persisting practice content, typing sessions, and user preferences.

### **3.1 Core Entities**

#### **Practice Content**
```json
{
  "id": "content_001",
  "type": "english", // "english" or "chinese"
  "text": "The quick brown fox jumps over the lazy dog.",
  "pinyin": ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]
}
```

#### **Typing Session**
```json
{
  "sessionId": "session_001",
  "practiceContentId": "content_001",
  "startTime": "2023-10-05T14:48:00Z",
  "endTime": "2023-10-05T14:50:00Z",
  "accuracy": 95.6, // Percentage
  "speed": 120, // Characters per minute (CPM)
  "errors": [
    {
      "character": "q",
      "expected": "w",
      "position": 5
    }
  ]
}
```

#### **User Preferences**
```json
{
  "fontSize": "large", // "small", "medium", "large"
  "highContrastMode": true,
  "languagePreference": "english" // "english" or "chinese"
}
```

### **3.2 Entity Relationship Diagram (ERD)**
```plantuml
@startuml
entity PracticeContent {
  * id : string
  --
  type : string
  text : string
  pinyin : array<string>
}

entity TypingSession {
  * sessionId : string
  --
  practiceContentId : string
  startTime : datetime
  endTime : datetime
  accuracy : float
  speed : int
  errors : array<object>
}

entity UserPreferences {
  fontSize : string
  highContrastMode : boolean
  languagePreference : string
}

PracticeContent ||--o{ TypingSession : references
@enduml
```

---

## **4. Interface Design**
The interface design ensures seamless communication between internal modules and LocalStorage.

### **4.1 Internal API Endpoints**

#### **Practice Content Management**
- **Create/Update Practice Content**:  
  - Method: `POST`
  - Endpoint: `/api/practice-content` *(internal module call)*
  - Request Body:
    ```json
    {
      "id": "content_001",
      "type": "english",
      "text": "The quick brown fox jumps over the lazy dog.",
      "pinyin": ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]
    }
    ```

#### **Typing Session Management**
- **Save Typing Session**:  
  - Method: `POST`
  - Endpoint: `/api/typing-session` *(internal module call)*
  - Request Body:
    ```json
    {
      "sessionId": "session_001",
      "practiceContentId": "content_001",
      "startTime": "2023-10-05T14:48:00Z",
      "endTime": "2023-10-05T14:50:00Z",
      "accuracy": 95.6,
      "speed": 120,
      "errors": [
        {
          "character": "q",
          "expected": "w",
          "position": 5
        }
      ]
    }
    ```

#### **User Preferences**
- **Save User Preferences**:  
  - Method: `POST`
  - Endpoint: `/api/user-preferences` *(internal module call)*
  - Request Body:
    ```json
    {
      "fontSize": "large",
      "highContrastMode": true,
      "languagePreference": "english"
    }
    ```

### **4.2 Message Formats**
All internal API calls will use **JSON** as the message format for request/response payloads.

---

## **5. Deployment Architecture**
The deployment architecture leverages **AWS S3 + CloudFront** for hosting and **GitHub Actions** for CI/CD.

### **5.1 Cloud Environment**
- **Frontend Hosting**:  
  - **Amazon S3**: Hosts static assets (HTML, CSS, JavaScript/TypeScript files) for the React-based SPA.
  - **Amazon CloudFront**: Acts as a Content Delivery Network (CDN) to cache and distribute the static assets globally for faster load times.

### **5.2 Security Considerations**
- **HTTPS Enforcement**:  
  - CloudFront automatically provides SSL/TLS certificates via AWS Certificate Manager (ACM), ensuring that all traffic between users and the application is encrypted.
  
- **S3 Bucket Policies**:  
  - The S3 bucket containing the static assets will have strict bucket policies to prevent unauthorized access. Only CloudFront will have read access to the bucket, while direct public access to the bucket will be disabled.

- **CORS Configuration**:  
  - Cross-Origin Resource Sharing (CORS) rules will be configured in the S3 bucket to allow only specific origins (e.g., your domain) to access the resources.

### **5.3 Scalability and Performance**
- **Global Content Delivery**:  
  - CloudFront ensures low-latency access by caching content at edge locations around the world. This improves performance for users regardless of their geographic location.
  
- **Static Asset Optimization**:  
  - The React application will be built with optimized assets (minified JavaScript, CSS, and images) to reduce load times.
  - Gzip/Brotli compression will be enabled on CloudFront to further optimize asset delivery.

### **5.4 CI/CD Pipeline Workflow**
Here’s how the CI/CD pipeline will work with **GitHub Actions**:

1. **Trigger**:  
   - The pipeline is triggered on every push to the `main` branch or when a new release is created.

2. **Build Phase**:
   - Install dependencies: `npm install`.
   - Build the React application: `npm run build`.

3. **Test Phase**:
   - Run unit tests: `npm test`.
   - Run end-to-end tests (optional): Cypress tests can be run in a headless browser environment.

4. **Deploy Phase**:
   - Sync the built static files to the S3 bucket using the AWS CLI:  
     ```bash
     aws s3 sync build/ s3://your-bucket-name --delete
     ```
   - Invalidate the CloudFront cache to ensure the latest version is served:  
     ```bash
     aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
     ```

### **5.5 Monitoring & Logging**
- **CloudWatch Logs**:  
  - Enable logging for S3 and CloudFront to monitor access patterns and troubleshoot issues.
  
- **Error Monitoring**:  
  - Use tools like **Sentry** or **LogRocket** to capture frontend errors and monitor user interactions in real-time.

---

## **6. Repository Structure**
The repository is organized to ensure maintainability and ease of navigation.

```
typing-practice-program/
├── docs/               # Documentation files
│   ├── architecture.md # System architecture diagrams and descriptions
│   ├── api-specs.md    # API specifications (internal module calls)
│   └── deployment.md   # Deployment instructions and CI/CD pipeline details
├── public/             # Public assets (e.g., favicon.ico, robots.txt)
├── src/                # Source code files
│   ├── components/     # Reusable UI components
│   │   ├── Header.tsx  # Application header component
│   │   ├── Footer.tsx  # Application footer component
│   │   └── TypingArea.tsx # Typing practice area component
│   ├── pages/          # Application pages
│   │   ├── Home.tsx    # Homepage with practice content selection
│   │   ├── Practice.tsx # Typing practice page
│   │   ├── Settings.tsx # User preferences/settings page
│   │   └── Progress.tsx # Progress monitoring page for parents
│   ├── hooks/          # Custom React hooks
│   │   ├── useLocalStorage.ts # Hook for interacting with LocalStorage
│   │   └── useTypingSession.ts # Hook for managing typing sessions
│   ├── context/        # Context API for global state management
│   │   └── AppContext.tsx # Global state for practice content, sessions, and preferences
│   ├── utils/          # Utility functions
│   │   ├── pinyinUtils.ts # Helper functions for handling Chinese pinyin
│   │   └── fileExport.ts # Functions for exporting data as JSON files
│   ├── App.tsx         # Main application entry point
│   └── index.tsx       # Root file to render the React app
├── tests/              # Test files
│   ├── unit/           # Unit tests
│   │   ├── TypingEngine.test.ts # Tests for typing engine logic
│   │   └── PinyinEngine.test.ts # Tests for pinyin input validation
│   ├── integration/    # Integration tests
│   │   └── App.test.tsx # Integration tests for the entire app
│   └── e2e/            # End-to-end tests (optional)
│       └── cypress/    # Cypress test files
├── config/             # Configuration files
│   ├── webpack.config.js # Webpack configuration (if not using Create React App)
│   ├── jest.setup.js   # Jest setup file for testing
│   └── tailwind.config.js # Tailwind CSS configuration
├── .github/            # GitHub Actions workflows
│   └── workflows/
│       └── ci-cd.yml   # CI/CD pipeline configuration for GitHub Actions
├── .env.example        # Example environment variables
├── package.json        # Node.js dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project overview and setup instructions
```

# React + TypeScript Coding Style Guide

## File Organization

### Folder Structure
```
src/
├── components/       # Reusable components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   ├── Button.test.tsx
│   │   └── index.ts
├── hooks/            # Custom hooks
├── pages/            # Page components
├── services/         # API services
├── store/            # State management
├── types/            # Global type definitions
├── utils/            # Utility functions
└── App.tsx
```

### File Naming
- Use PascalCase for components (`Button.tsx`)
- Use camelCase for non-component files (`apiService.ts`)
- Prefix hooks with `use` (`useFetchData.ts`)
- Suffix test files with `.test.tsx`

## Component Structure

### Functional Components
```tsx
import React, { useState } from 'react';
import styles from './Component.module.css';

interface ComponentProps {
  requiredProp: string;
  optionalProp?: number;
}

const Component: React.FC<ComponentProps> = ({
  requiredProp,
  optionalProp = 42,
}) => {
  const [state, setState] = useState<string>('');

  const handleClick = () => {
    setState('Updated');
  };

  return (
    <div className={styles.wrapper}>
      <button onClick={handleClick}>{requiredProp}</button>
      <p>{state}</p>
    </div>
  );
};

export default Component;
```

### Class Components (only when necessary)
```tsx
import React from 'react';

interface State {
  count: number;
}

interface Props {
  initialCount: number;
}

class Counter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { count: props.initialCount };
  }

  increment = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default Counter;
```

## TypeScript Conventions

### Type Definitions
```typescript
// Use interfaces for props and state
interface User {
  id: number;
  name: string;
  email?: string; // Optional property
}

// Use type aliases for complex types
type UserList = Array<User>;

// Use enums for fixed sets of values
enum Status {
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}
```

### Props
- Always define prop types using interfaces
- Mark optional props with `?`
- Provide default values for optional props when possible
- Avoid using `any` type

## Hooks

### useState
```typescript
const [count, setCount] = useState<number>(0); // Explicit type
const [user, setUser] = useState<User | null>(null); // Union type
```

### useEffect
```typescript
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    setData(data);
  };

  fetchData();
}, [dependency]); // Always specify dependencies
```

### Custom Hooks
```typescript
import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [state, setState] = useState<UseFetchResult<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error });
      }
    };

    fetchData();
  }, [url]);

  return state;
}
```

## Styling

### CSS Modules (Preferred)
```tsx
import styles from './Button.module.css';

const Button = () => (
  <button className={styles.primary}>Click me</button>
);
```

### Styled Components
```tsx
import styled from 'styled-components';

const StyledButton = styled.button<{ primary?: boolean }>`
  background: ${(props) => (props.primary ? 'blue' : 'gray')};
  color: white;
  padding: 8px 16px;
`;

const Button = () => (
  <StyledButton primary>Click me</StyledButton>
);
```

## Best Practices

1. **Component Design**
   - Keep components small and focused (Single Responsibility Principle)
   - Prefer functional components over class components
   - Use composition over inheritance

2. **Type Safety**
   - Avoid `any` type - always specify types
   - Use type guards for runtime type checking
   ```typescript
   function isUser(obj: unknown): obj is User {
     return (obj as User).name !== undefined;
   }
   ```

3. **State Management**
   - Lift state up when multiple components need access
   - Consider context API for global state
   - Use Redux/Toolkit for complex state management

4. **Performance**
   - Use `React.memo` for memoizing components
   - Use `useCallback` for memoizing event handlers
   - Use `useMemo` for expensive calculations

5. **Testing**
   - Write unit tests for components and hooks
   - Use Testing Library for React testing
   - Test prop types and component behavior

## ESLint Configuration

Recommended `.eslintrc`:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react/prop-types": "off", // Not needed with TypeScript
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## Prettier Configuration

Recommended `.prettierrc`:
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always"
}
```

## Editor Configuration

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```
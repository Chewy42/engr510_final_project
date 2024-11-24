# Frontend Documentation

## Overview
The frontend is built using React with TypeScript, utilizing modern web development practices and tools including:
- React 18+ with TypeScript
- Redux for state management
- TailwindCSS for styling
- Cypress for testing

## Project Structure
```
frontend/
├── src/
│   ├── app/          # Application configuration
│   ├── components/   # Reusable UI components
│   ├── features/     # Feature-specific components and logic
│   ├── hooks/        # Custom React hooks
│   ├── layouts/      # Page layout components
│   ├── pages/        # Page components
│   ├── routes/       # Routing configuration
│   ├── store/        # Redux store setup and slices
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── public/           # Static assets
└── cypress/          # End-to-end tests
```

## Core Components
### App Entry Point
The application entry point is in `src/App.tsx`, which sets up the routing and global providers.

### Layouts
Located in `src/layouts/`, these components provide consistent page structures:
- `DashboardLayout.tsx`: Main application layout with navigation and common UI elements

### Pages
Found in `src/pages/`, each representing a distinct route:
- `Dashboard.tsx`: Main dashboard interface
- Additional pages for specific features

### State Management
Redux is used for global state management:
- Store configuration in `src/store/`
- Feature-specific slices for modular state management

### Routing
Route definitions and navigation logic are in `src/routes/`:
- Protected routes for authenticated users
- Public routes for unauthenticated access

## Component Architecture

### Layout System
The application uses a nested layout structure:

1. **DashboardLayout** (`src/layouts/DashboardLayout.tsx`)
   - Provides the main application shell
   - Features a responsive sidebar with navigation
   - Manages user authentication state
   - Components:
     - Sidebar with navigation items
     - Header with user menu
     - Main content area using `<Outlet/>` for nested routes
   - Uses Redux for sidebar state management via `uiSlice`

### Page Components

#### Dashboard (`src/pages/Dashboard.tsx`)
The main dashboard interface includes:
- Welcome header with user information
- Stats cards showing:
  - Active Projects
  - Tasks Due Today
  - Team Members
- Uses Material Design icons (`react-icons/md`)
- Implements hover animations and transitions
- Connects to Redux store for auth state

### State Management Architecture

#### Redux Store Organization
1. **Auth Slice**
   - Manages user authentication state
   - Used by Dashboard and DashboardLayout

2. **UI Slice**
   - Controls sidebar visibility
   - Manages UI-related state
   - Used by DashboardLayout for responsive behavior

### Component Interactions
1. **Authentication Flow**
   - `useAuth` hook provides authentication methods
   - Components access auth state via Redux
   - Protected routes in `src/routes` enforce authentication

2. **Navigation System**
   - Centralized navigation configuration in DashboardLayout
   - Uses React Router v6 with `<Outlet/>` for nested routing
   - Navigation state synced with Redux

3. **Responsive Design**
   - Sidebar toggles automatically on mobile
   - Uses Tailwind breakpoints for responsive layouts
   - Smooth transitions and animations

### UI/UX Patterns
1. **Consistent Styling**
   - Color scheme: 
     - Primary: Blue-500 for accents
     - Background: Gray-50, Gray-100
     - Text: Gray-900, Gray-500
   - Card patterns with hover effects
   - Standardized spacing using Tailwind classes

2. **Interactive Elements**
   - Hover animations on cards
   - Transition effects on sidebar
   - Responsive click/touch areas

## Custom Hooks and Reusable Logic

### Authentication Hook (`useAuth`)

1. **Purpose**
   - Provides centralized authentication logic
   - Encapsulates Redux state and actions
   - Offers type-safe authentication methods

2. **Features**
   ```typescript
   const {
     isAuthenticated,  // Boolean indicating auth status
     loading,         // Loading state for async operations
     error,          // Error state
     token,          // JWT token
     login,          // Async login function
     logout          // Sync logout function
   } = useAuth();
   ```

3. **Usage Pattern**
   ```typescript
   // In components
   const { login, logout, isAuthenticated } = useAuth();
   
   // Login
   try {
     await login(email, password);
     // Handle success
   } catch (error) {
     // Handle error
   }
   
   // Logout
   logout();
   ```

### App Store Hook (`useAppStore`)

1. **Purpose**
   - Provides typed access to Redux store
   - Encapsulates dispatch and selector logic
   - Ensures consistent state access patterns

2. **Benefits**
   - Type safety with TypeScript
   - Centralized state access
   - Reduced boilerplate in components

### Best Practices for Custom Hooks

1. **Hook Organization**
   - Place in `src/hooks` directory
   - One hook per file
   - Include test files in `__tests__` directory

2. **Naming Conventions**
   - Prefix with `use`
   - Descriptive of functionality
   - Consistent with React conventions

3. **Implementation Guidelines**
   - Keep hooks focused and single-purpose
   - Handle cleanup in useEffect
   - Provide comprehensive TypeScript types
   - Include error handling

4. **Testing Strategy**
   - Test hook in isolation
   - Mock Redux store when needed
   - Test error cases
   - Verify cleanup functions

## Testing Architecture

### Testing Stack
The application uses a comprehensive testing setup:

1. **Core Testing Libraries**
   - Jest as the test runner
   - React Testing Library for component testing
   - Cypress for end-to-end testing

2. **Test Types**
   - Unit tests in `src/__tests__`
   - Component tests alongside components
   - End-to-end tests in `cypress` directory

### Testing Patterns

1. **Authentication Testing**
   ```typescript
   describe('Authentication Tests', () => {
     it('should redirect when not authenticated', () => {
       // Test unauthenticated state
     });

     it('should show content when authenticated', () => {
       // Test authenticated state
     });
   });
   ```

2. **Test Setup**
   - Mock store configuration
   - Router wrapper components
   - Common test utilities

3. **Testing Best Practices**
   - Test behavior, not implementation
   - Use meaningful test descriptions
   - Follow AAA pattern (Arrange, Act, Assert)
   - Mock external dependencies

### Component Testing Strategy

1. **Render Testing**
   - Verify component rendering
   - Check for required elements
   - Test responsive behavior

2. **Interaction Testing**
   - User event simulation
   - Form submissions
   - Button clicks
   - Navigation

3. **State Testing**
   - Redux state changes
   - Local state updates
   - Side effects

### End-to-End Testing

1. **Cypress Setup**
   - Configuration in `cypress.config.ts`
   - Custom commands
   - Fixtures for test data

2. **Test Scenarios**
   - User flows
   - Authentication
   - Navigation
   - Data persistence

3. **Best Practices**
   - Use data-testid for selections
   - Avoid timing issues
   - Clean up test data
   - Test error scenarios

### Test Organization

1. **Directory Structure**
   ```
   frontend/
   ├── src/
   │   ├── __tests__/          # Unit tests
   │   │   └── auth.test.tsx   # Authentication tests
   │   └── components/
   │       └── __tests__/      # Component tests
   └── cypress/
       ├── e2e/               # End-to-end tests
       └── support/           # Test helpers
   ```

2. **Naming Conventions**
   - `*.test.tsx` for React component tests
   - `*.spec.ts` for unit tests
   - `*.cy.ts` for Cypress tests

## Authentication System

### Authentication Architecture
The application uses a token-based authentication system implemented with Redux Toolkit:

1. **Auth State** (`src/features/auth/authSlice.ts`)
   - Manages authentication state including:
     - JWT token
     - Authentication status
     - Loading state
     - Error handling
     - User information
   
2. **Token Management**
   - Tokens stored in localStorage
   - Automatically loaded on application start
   - Attached to axios headers for API requests
   - Environment-aware API URL configuration

3. **Authentication Flow**
   ```
   User Login → API Request → Token Storage → Redux State Update → Route Navigation
   ```

4. **Security Features**
   - Bearer token authentication
   - Automatic token injection in API requests
   - Error handling and validation
   - Protected route guards

### API Integration

1. **Base Configuration**
   - API URL configurable via environment variables
   - Fallback to `http://localhost:5000/api`
   - Axios instance with interceptors

2. **Error Handling**
   - Centralized error management
   - Automatic error clearing
   - User-friendly error messages

## State Management Details

### Redux Store Architecture

1. **Auth Slice**
   ```typescript
   interface AuthState {
     token: string | null;
     isAuthenticated: boolean;
     loading: boolean;
     error: string | null;
     user: {
       email: string;
     } | null;
   }
   ```
   - Manages user session
   - Handles async authentication operations
   - Provides authentication status

2. **UI Slice**
   - Controls UI state
   - Manages responsive behaviors
   - Handles user preferences

3. **State Access Patterns**
   - Components use `useSelector` for state access
   - Actions dispatched via `useDispatch`
   - Async operations via `createAsyncThunk`

### Data Flow

1. **Component to State**
   ```
   User Action → Dispatch Action → Async Operation → State Update → UI Update
   ```

2. **State to Component**
   ```
   State Change → Selector Update → Component Re-render → UI Update
   ```

## Development Guidelines
1. Component Organization:
   - Reusable components go in `src/components/`
   - Feature-specific components go in `src/features/`
   - Page components go in `src/pages/`

2. State Management:
   - Use Redux for global state
   - Use React's useState for local component state
   - Custom hooks in `src/hooks/` for reusable stateful logic

3. Styling:
   - TailwindCSS for utility-first styling
   - Custom styles in component-specific CSS modules when needed

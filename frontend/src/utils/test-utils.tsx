import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { rootReducer, RootState } from '../store/rootReducer';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';

// Custom render function that includes providers
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: ReturnType<typeof configureStore>;
}

function render(
  ui: ReactElement,
  {
    preloadedState = {} as PreloadedState<RootState>,
    store = configureStore({ reducer: rootReducer, preloadedState }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
  return {
    store,
    user: userEvent.setup(),
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };

// Test utilities
export const createMockStore = (preloadedState: Partial<RootState> = {}) => {
  return configureStore({ reducer: rootReducer, preloadedState });
};

export const mockApiResponse = <T,>(data: T, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
};

export const mockApiError = (status = 500, message = 'Internal Server Error') => {
  return Promise.reject({
    status,
    message,
  });
};

// Common test data generators
export interface TestUser {
  id: number;
  email: string;
  [key: string]: any;
}

export interface TestProject {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
  [key: string]: any;
}

export const generateTestUser = (overrides: Partial<TestUser> = {}): TestUser => ({
  id: 1,
  email: 'test@example.com',
  ...overrides,
});

export const generateTestProject = (overrides: Partial<TestProject> = {}): TestProject => ({
  id: 1,
  name: 'Test Project',
  description: 'A test project',
  status: 'in_progress',
  created_at: new Date().toISOString(),
  ...overrides,
});

// Common test matchers
export const matchTextContent = (text: string) => (element: Element): boolean => {
  return element.textContent?.includes(text) ?? false;
};

export const matchAriaLabel = (label: string) => (element: Element): boolean => {
  return element.getAttribute('aria-label') === label;
};

// Async utilities
export const waitForLoadingToFinish = async (): Promise<void> => {
  // Add custom logic here based on your loading indicators
};

// Mock window utilities
export const mockWindowLocation = (url: string): () => void => {
  const oldLocation = window.location;
  delete (window as any).location;
  window.location = new URL(url) as any;
  return () => {
    window.location = oldLocation;
  };
};

// Mock intersection observer
export const mockIntersectionObserver = (): jest.Mock => {
  const mock = jest.fn();
  mock.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mock as any;
  return mock;
};

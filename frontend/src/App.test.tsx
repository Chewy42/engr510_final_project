import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './store/slices/authSlice';
import projectReducer, { ProjectState } from './store/slices/projectSlice';
import App from './App';

interface RootState {
  auth: AuthState;
  project: ProjectState;
}

const renderWithProviders = (
  ui: React.ReactElement,
  options: {
    preloadedState?: PreloadedState<RootState>;
    store?: ReturnType<typeof configureStore>;
  } = {}
) => {
  const store = options.store ?? configureStore({
    reducer: {
      auth: authReducer,
      project: projectReducer,
    },
    preloadedState: options.preloadedState,
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
};

test('renders app without crashing', async () => {
  renderWithProviders(<App />);
  
  // Wait for any initial loading states to resolve
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});

test('shows login page for unauthenticated users', async () => {
  renderWithProviders(<App />);
  
  // Verify that unauthenticated users see the login page
  expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
});

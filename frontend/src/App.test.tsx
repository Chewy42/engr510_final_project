import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/slices/authSlice';
import projectReducer from './store/slices/projectSlice';
import App from './App';

const renderWithProviders = async (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        project: projectReducer
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  const rendered = render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>,
    renderOptions
  );

  // Wait for any initial loading states to resolve
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  return rendered;
};

test('renders app without crashing', async () => {
  await renderWithProviders(<App />);
  
  // Verify that the app has rendered some basic content
  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
});

test('shows login page for unauthenticated users', async () => {
  await renderWithProviders(<App />);
  
  // Verify that unauthenticated users see the login page
  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
});

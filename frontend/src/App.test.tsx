import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import authReducer from './features/auth/authSlice';
import { RootState } from './store/store';

const renderWithProviders = (
  ui: React.ReactElement,
  {
    initialState,
    store = configureStore({
      reducer: {
        auth: authReducer,
      } as any,
      preloadedState: initialState,
    }),
  }: {
    initialState?: Partial<RootState>;
    store?: ReturnType<typeof configureStore>;
  } = {}
) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(document.querySelector('div')).toBeInTheDocument();
  });

  it('shows authentication-related content', () => {
    renderWithProviders(<App />);
    // This should match text that appears in either the sign-in page or dashboard
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});

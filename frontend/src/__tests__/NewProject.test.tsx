import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import NewProject from '../pages/NewProject';

const mockStore = configureStore([thunk]);

describe('NewProject Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      ai: {
        processing: false,
        messages: []
      },
      project: {
        nodes: [],
        edges: []
      }
    });
  });

  test('renders project creation form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <NewProject />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Enter your project description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate/i })).toBeInTheDocument();
  });

  test('handles project generation submission', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <NewProject />
        </BrowserRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText(/Enter your project description/i);
    const submitButton = screen.getByRole('button', { name: /Generate/i });

    fireEvent.change(input, { target: { value: 'Create a React app with TypeScript' } });
    fireEvent.click(submitButton);

    const actions = store.getActions();
    expect(actions).toContainEqual(expect.objectContaining({
      type: 'project/generateProjectStructure'
    }));
  });

  test('displays loading state during generation', () => {
    store = mockStore({
      ai: {
        processing: true,
        messages: []
      },
      project: {
        nodes: [],
        edges: []
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <NewProject />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Generating/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate/i })).toBeDisabled();
  });
});

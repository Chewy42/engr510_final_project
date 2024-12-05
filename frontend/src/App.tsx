import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { initializeAuth } from './store/slices/authSlice';
import { CircularProgress } from '@mui/material';

const AppContent: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await store.dispatch(initializeAuth());
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return <AppRoutes />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </Provider>
  );
};

export default App;

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './routes';
import { initializeAuth } from './store/slices/authSlice';

const AppContent: React.FC = () => {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);

  return <AppRoutes />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;

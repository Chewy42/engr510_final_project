import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { login as loginAction, logout as logoutAction } from '../features/auth/authSlice';
import { AppDispatch } from '../app/store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, error, token } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      await dispatch(loginAction({ email, password })).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    isAuthenticated,
    loading,
    error,
    token,
    login,
    logout,
  };
};

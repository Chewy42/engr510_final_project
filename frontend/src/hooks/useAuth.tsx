import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { login as loginAction, logout as logoutAction } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (email: string, password: string) => {
    try {
      await dispatch(loginAction({ email, password })).unwrap();
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    isAuthenticated,
    loading,
    error,
    user,
    login,
    logout,
  };
};

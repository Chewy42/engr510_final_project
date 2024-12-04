import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  login as loginAction,
  logout as logoutAction,
  register as registerAction,
  refreshToken as refreshTokenAction,
} from '../store/slices/authSlice';
import { useEffect, useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, error, token, user, initialized } = useSelector(
    (state: RootState) => state.auth
  );

  // Setup token refresh interval
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    if (isAuthenticated && token) {
      // Refresh token 5 minutes before expiry (assuming 1-hour tokens)
      refreshInterval = setInterval(() => {
        dispatch(refreshTokenAction());
      }, 55 * 60 * 1000); // 55 minutes
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isAuthenticated, token, dispatch]);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      await dispatch(loginAction({ email, password, rememberMe })).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const register = useCallback(async (email: string, password: string) => {
    try {
      await dispatch(registerAction({ email, password })).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const refreshToken = useCallback(async () => {
    try {
      await dispatch(refreshTokenAction()).unwrap();
    } catch (error) {
      // If refresh fails, log out the user
      logout();
      throw error;
    }
  }, [dispatch, logout]);

  return {
    isAuthenticated,
    loading,
    error,
    token,
    user,
    initialized,
    login,
    register,
    logout,
    refreshToken,
  };
};

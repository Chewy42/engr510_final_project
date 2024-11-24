import { RouteObject } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Landing from '../pages/Landing';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      // Add more dashboard routes here as needed
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

// Layouts
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));

// Pages
const Landing = lazy(() => import('../pages/Landing'));
const SignIn = lazy(() => import('../pages/SignIn'));
const SignUp = lazy(() => import('../pages/SignUp'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const AIAssistant = lazy(() => import('../components/GenerativeComponent/AIInteractionPanel'));
const NotFound = lazy(() => import('../pages/NotFound'));
const ProjectsList = lazy(() => import('../pages/ProjectsList'));
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'));
const ProjectGenerationPage = lazy(() => import('../pages/ProjectGeneration'));
const FileGenerationPage = lazy(() => import('../pages/FileGenerationPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />

        {/* Auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route index element={<Navigate to="signin" replace />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="generate" element={<ProjectGenerationPage />} />
          <Route path="files" element={<FileGenerationPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/auth/signin" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
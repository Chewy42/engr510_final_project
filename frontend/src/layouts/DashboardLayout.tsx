import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleSidebar } from '../store/slices/uiSlice';
import { MdRocketLaunch, MdDashboard, MdGroup, MdSettings, MdChat, MdFolder } from 'react-icons/md';
import AIInteractionPanel from '../components/GenerativeComponent/AIInteractionPanel';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: MdDashboard,
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: MdRocketLaunch,
  },
  {
    name: 'Files',
    href: '/dashboard/files',
    icon: MdFolder,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: MdSettings,
  },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { sidebarOpen, showAIAssistant } = useSelector((state: RootState) => state.ui);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-gray-800 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        {/* Logo section */}
        <div className="flex items-center h-16 px-4 bg-gray-900">
          <MdRocketLaunch className="h-8 w-8 text-blue-500" />
          <span className="ml-2 text-xl font-semibold text-white">ProjectFlow</span>
        </div>

        {/* Navigation section */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-2 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group"
            >
              <item.icon className="mr-4 h-6 w-6" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center px-4 py-2 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-150 ease-in-out"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* AI Assistant Panel - Only show on project pages and when enabled */}
      {location.pathname.includes('/dashboard/projects/') && showAIAssistant && (
        <div className="fixed bottom-0 right-0 w-96 transform transition-transform duration-200 ease-in-out">
          <AIInteractionPanel />
        </div>
      )}
    </div>
  );
}

import { Outlet } from 'react-router-dom';
import { MdRocketLaunch } from 'react-icons/md';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <MdRocketLaunch className="h-12 w-12 text-blue-600" />
          <span className="ml-2 text-2xl font-semibold text-gray-900">ProjectFlow</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

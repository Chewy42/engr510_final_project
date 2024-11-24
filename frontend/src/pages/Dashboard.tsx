import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { MdDashboard, MdAccessTime, MdGroup } from 'react-icons/md';

export default function Dashboard() {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="pb-5 border-b border-gray-200">
          <h1 className="text-4xl font-medium text-gray-900 transition-all duration-300 ease-in-out hover:text-gray-700">
            Welcome{auth.user?.email ? `, ${auth.user.email}` : ''}
          </h1>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Stats cards */}
            <div className="bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MdDashboard className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Projects
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 mt-1">12</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MdAccessTime className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tasks Due Today
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 mt-1">5</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MdGroup className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Team Members
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 mt-1">8</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="mt-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h2>
          <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <li key={activity.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {activity.project}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {activity.type}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {activity.description}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{activity.date}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const recentActivity = [
  {
    id: 1,
    project: 'Website Redesign',
    type: 'Update',
    description: 'New mockups added',
    date: '3h ago',
  },
  {
    id: 2,
    project: 'Mobile App',
    type: 'New',
    description: 'Project created',
    date: '5h ago',
  },
  {
    id: 3,
    project: 'Marketing Campaign',
    type: 'Complete',
    description: 'Campaign launched successfully',
    date: '1d ago',
  },
];

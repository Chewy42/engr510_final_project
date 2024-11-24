import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { MdRocketLaunch, MdAutoAwesome, MdGroups, MdSpeed } from 'react-icons/md';

interface Feature {
  name: string;
  description: string;
  icon: any;
}

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="fixed w-full bg-white shadow-sm z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <MdRocketLaunch className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">ProjectFlow</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/auth/signin"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link to="/auth/signup">
                <Button variant="primary" size="sm" className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <main>
        <div className="relative">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative sm:overflow-hidden">
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <h1 className="text-center text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Supercharge your</span>
                  <span className="block text-blue-600">project management</span>
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-center text-xl text-gray-500 sm:max-w-3xl">
                  Streamline your workflow with our intuitive project management tools powered by cutting-edge AI technology.
                </p>
                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5">
                    <Link to="/auth/signup">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        className="w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        Get started for free
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to succeed
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Powerful tools to help you manage your projects more effectively.
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {features.map((feature) => (
                  <div key={feature.name} className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white transform transition-transform duration-200 hover:scale-110">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        {feature.name}
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {/* Add social links here if needed */}
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2024 Matthew Favela, Mason Pennell, and Marco Costa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Features data
const features: Feature[] = [
  {
    name: 'AI-Powered Insights',
    description: 'Get intelligent suggestions and insights to optimize your project workflow.',
    icon: MdAutoAwesome,
  },
  {
    name: 'Real-time Collaboration',
    description: 'Work together with your team in real-time with seamless collaboration tools.',
    icon: MdGroups,
  },
  {
    name: 'Lightning Fast',
    description: 'Experience blazing-fast performance with our optimized platform.',
    icon: MdSpeed,
  },
  {
    name: 'Advanced Analytics',
    description: 'Make data-driven decisions with comprehensive project analytics.',
    icon: MdRocketLaunch,
  },
];

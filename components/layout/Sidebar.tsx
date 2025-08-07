import React, { useState, useEffect } from 'react';
import { routes } from '../../routing';
import { XIcon } from '../icons/XIcon';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const NavLink: React.FC<{ route: typeof routes[0] }> = ({ route }) => {
    const isActive = currentPath === route.path;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.location.hash = route.path;
      setSidebarOpen(false);
    };

    return (
      <a
        href={route.path}
        onClick={handleClick}
        className={`
          flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-150 group
          ${
            isActive
              ? 'bg-primary-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
          }
        `}
      >
        <route.icon
          className={`w-6 h-6 mr-3 transition-colors duration-150 ${
            isActive ? 'text-white' : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
          }`}
        />
        <span>{route.name}</span>
      </a>
    );
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
               <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 tracking-tighter">
                echo
              </h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {routes.map((route) => (
                <NavLink key={route.path} route={route} />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-700 pt-5 bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 tracking-tighter">
                echo
            </h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 pb-4 space-y-2">
              {routes.map((route) => (
                <NavLink key={route.path} route={route} />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
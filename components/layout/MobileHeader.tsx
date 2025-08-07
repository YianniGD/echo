import React, { useState, useEffect } from 'react';
import { routes } from '../../routing';
import { MenuIcon } from '../icons/MenuIcon';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  const [title, setTitle] = useState('Dashboard');

  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash || '#/dashboard';
      const currentRoute = routes.find((route) => route.path === path);
      setTitle(currentRoute?.name || 'Dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Set initial title
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <button
        type="button"
        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" />
      </button>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
      <div className="w-12"></div> {/* Spacer */}
    </div>
  );
};

export default MobileHeader;

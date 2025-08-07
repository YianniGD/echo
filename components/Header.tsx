
import React from 'react';
import { PenSquareIcon } from './icons/PenSquareIcon';

interface HeaderProps {
  onNewEntry: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewEntry }) => {
  return (
    <header className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
        Journal
      </h1>
       <button
        onClick={onNewEntry}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
      >
        <PenSquareIcon className="w-5 h-5" />
        <span className="hidden sm:inline">New Entry</span>
      </button>
    </header>
  );
};

export default Header;
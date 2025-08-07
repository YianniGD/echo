
import React from 'react';
import { PenSquareIcon } from '../icons/PenSquareIcon';

interface Props {
  className?: string;
}

const DashboardWelcomeWidget: React.FC<Props> = ({ className }) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

  return (
    <div className={`p-6 border dark:border-gray-700 rounded-xl bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{formattedDate}</p>
      </div>
      <button 
        onClick={() => window.location.hash = '#/journal'} 
        className="flex-shrink-0 flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
      >
        <PenSquareIcon className="w-5 h-5" />
        <span>New Journal Entry</span>
      </button>
    </div>
  );
};

export default DashboardWelcomeWidget;

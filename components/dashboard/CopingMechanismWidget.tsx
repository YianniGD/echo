import React from 'react';
import { LifeBuoyIcon } from '../icons/LifeBuoyIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface Props {
    className?: string;
}

const CopingMechanismWidget: React.FC<Props> = ({ className }) => {
  const handleNavigate = () => {
    window.location.hash = '#/resources';
  };

  return (
    <div
      onClick={handleNavigate}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate()}
      role="button"
      tabIndex={0}
      className={`cursor-pointer group p-5 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${className}`}
    >
      <div>
        <div className="flex items-center gap-3">
          <LifeBuoyIcon className="w-6 h-6 text-primary-500" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Resources & Techniques</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Explore mindfulness exercises, CBT guides, and other tools to support your well-being.
        </p>
      </div>
      <div className="flex justify-end items-center mt-4">
        <div className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400">
            Explore Resources <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

export default CopingMechanismWidget;
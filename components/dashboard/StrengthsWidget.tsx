import React from 'react';
import { AwardIcon } from '../icons/AwardIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface Props {
  strengths: string[];
  className?: string;
}

const StrengthsWidget: React.FC<Props> = ({ strengths, className }) => {
  return (
    <div className={`p-5 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md flex flex-col h-full ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
            <AwardIcon className="w-6 h-6 text-primary-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">My Strengths</h3>
        </div>
      </div>
      <div className="flex-grow flex flex-wrap gap-2 content-start my-4">
          {strengths.length > 0 ? (
            strengths.slice(0, 5).map(strength => (
                <div key={strength} className="px-2.5 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200 rounded-full text-sm font-medium">
                    {strength}
                </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No strengths selected yet.</p>
            </div>
          )}
          {strengths.length > 5 && (
            <div className="px-2.5 py-1 bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                +{strengths.length - 5} more
            </div>
          )}
      </div>
      <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700/50">
        <button onClick={() => window.location.hash = '#/resources'} className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            Manage Strengths <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StrengthsWidget;

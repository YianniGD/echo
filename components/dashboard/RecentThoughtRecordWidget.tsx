
import React from 'react';
import { ThoughtRecord } from '../../types';
import { LightbulbIcon } from '../icons/LightbulbIcon';
import { THOUGHT_RECORD_NAV_KEY } from '../../constants';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface Props {
  record: ThoughtRecord | null;
}

const RecentThoughtRecordWidget: React.FC<Props> = ({ record }) => {

  const handleNavigate = () => {
    if (record) {
        const navData = { recordId: record.id };
        localStorage.setItem(THOUGHT_RECORD_NAV_KEY, JSON.stringify(navData));
        window.location.hash = '#/thoughts';
    } else {
        window.location.hash = '#/thoughts';
    }
  };

  return (
    <div className="p-5 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md flex flex-col h-full">
      <div className="flex items-center gap-3">
        <LightbulbIcon className="w-6 h-6 text-primary-500" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Thought Record</h3>
      </div>
      <div className="flex-grow my-4">
        {record ? (
            <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(record.date).toLocaleDateString()}</p>
                <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-200">Situation:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {record.situation}
                    </p>
                </div>
            </div>
        ) : (
             <div className="h-full flex flex-col justify-center items-center text-center">
                <p className="text-gray-600 dark:text-gray-300 font-medium">No thought records yet.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ready to challenge a thought?</p>
            </div>
        )}
      </div>
       <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700/50">
        <button onClick={handleNavigate} className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            {record ? 'View Record' : 'New Record'} <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RecentThoughtRecordWidget;

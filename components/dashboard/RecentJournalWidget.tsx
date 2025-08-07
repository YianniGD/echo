
import React from 'react';
import { JournalEntry } from '../../types';
import { BookOpenCheckIcon } from '../icons/BookOpenCheckIcon';
import { MOOD_OPTIONS } from '../../constants';
import { JOURNAL_NAV_KEY } from '../../constants';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface Props {
  entry: JournalEntry | null;
}

const RecentJournalWidget: React.FC<Props> = ({ entry }) => {

  const handleNavigate = () => {
    if (entry) {
        const navData = { entryId: entry.id };
        localStorage.setItem(JOURNAL_NAV_KEY, JSON.stringify(navData));
        window.location.hash = '#/journal';
    } else {
        window.location.hash = '#/journal';
    }
  };

  const moodInfo = entry ? MOOD_OPTIONS[entry.mood] : null;

  return (
    <div className="p-5 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md flex flex-col h-full">
      <div className="flex items-center gap-3">
        <BookOpenCheckIcon className="w-6 h-6 text-primary-500" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Journal</h3>
      </div>
      <div className="flex-grow my-4">
        {entry ? (
            <div className="space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200">{entry.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                    {moodInfo && <span className={`text-2xl ${moodInfo.color}`}>{moodInfo.emoji}</span>}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {entry.content}
                </p>
            </div>
        ) : (
            <div className="h-full flex flex-col justify-center items-center text-center">
                <p className="text-gray-600 dark:text-gray-300 font-medium">No journal entries yet.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time to write down your thoughts!</p>
            </div>
        )}
      </div>
       <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700/50">
        <button onClick={handleNavigate} className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            {entry ? 'View Entry' : 'New Entry'} <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RecentJournalWidget;

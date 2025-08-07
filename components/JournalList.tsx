import React from 'react';
import { JournalEntry } from '../types';
import { MOOD_OPTIONS } from '../constants';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { TrashIcon } from './icons/TrashIcon';

interface JournalListProps {
  entries: JournalEntry[];
  onSelect: (entry: JournalEntry) => void;
  onNewEntry: () => void;
  onDelete: (id: string) => void;
}

const JournalList: React.FC<JournalListProps> = ({ entries, onSelect, onNewEntry, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">No Entries Yet</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Ready to capture your thoughts?</p>
        <button
          onClick={onNewEntry}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
        >
          <PlusCircleIcon className="w-6 h-6" />
          Create Your First Entry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entries.map(entry => {
        const moodInfo = MOOD_OPTIONS[entry.mood];
        
        const handleDeleteClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          onDelete(entry.id);
        };

        return (
          <div
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate pr-8">{entry.title}</h3>
                <span className={`text-2xl ${moodInfo.color}`}>{moodInfo.emoji}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {new Date(entry.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
                {entry.content}
              </p>
            </div>
            <button
              onClick={handleDeleteClick}
              aria-label="Delete entry"
              className="absolute top-3 right-3 p-2 rounded-full bg-white/50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 hover:!opacity-100 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/60 dark:hover:text-red-300 transition-opacity duration-200"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default JournalList;
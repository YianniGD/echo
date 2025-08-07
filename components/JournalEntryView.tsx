
import React from 'react';
import { JournalEntry } from '../types';
import { MOOD_OPTIONS } from '../constants';
import { EditIcon } from './icons/EditIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { TrashIcon } from './icons/TrashIcon';

interface JournalEntryViewProps {
  entry: JournalEntry;
  onEdit: () => void;
  onBack: () => void;
  onDelete: () => void;
}

const JournalEntryView: React.FC<JournalEntryViewProps> = ({ entry, onEdit, onBack, onDelete }) => {
  const moodInfo = MOOD_OPTIONS[entry.mood];
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 animate-fade-in-up">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to List
        </button>
      </div>

      <article>
        <header className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
              {entry.title}
            </h1>
            <div className="text-center flex-shrink-0">
                <span className={`text-4xl ${moodInfo.color}`}>{moodInfo.emoji}</span>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{moodInfo.label}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {formattedDate}
          </p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none mt-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {entry.content}
        </div>
      </article>

      <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-end gap-4">
        <button
          onClick={onDelete}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
          Delete
        </button>
        <button
          onClick={onEdit}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary-500"
        >
          <EditIcon className="w-5 h-5" />
          Edit
        </button>
      </footer>
    </div>
  );
};

export default JournalEntryView;

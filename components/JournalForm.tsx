
import React, { useState, useEffect } from 'react';
import { JournalEntry, Mood } from '../types';
import { MOOD_OPTIONS } from '../constants';
import { formatDateForInput } from '../utils/dateUtils';
import MoodSelector from './MoodSelector';

interface JournalFormProps {
  onSave: (entryData: Pick<JournalEntry, 'title' | 'content' | 'mood' | 'date'>) => void;
  onCancel: () => void;
  entry: JournalEntry | null;
  defaultDate?: string; // ISO string
}

const JournalForm: React.FC<JournalFormProps> = ({ onSave, onCancel, entry, defaultDate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.NEUTRAL);
  const [date, setDate] = useState(''); // YYYY-MM-DD

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood);
      setDate(formatDateForInput(entry.date));
    } else {
      setTitle('');
      setContent('');
      setMood(Mood.NEUTRAL);
      setDate(formatDateForInput(defaultDate || new Date().toISOString()));
    }
  }, [entry, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content && date) {
      const isoDate = new Date(date).toISOString();
      onSave({ title, content, mood, date: isoDate });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {entry ? 'Edit Entry' : 'New Entry'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
             <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            How are you feeling?
          </label>
          <MoodSelector selectedMood={mood} onSelectMood={setMood} />
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-end pt-4 gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary-500 disabled:bg-gray-400"
            disabled={!title || !content}
          >
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalForm;
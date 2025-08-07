
import React from 'react';
import { Mood } from '../types';
import { MOOD_OPTIONS } from '../constants';

interface MoodSelectorProps {
  selectedMood: Mood;
  onSelectMood: (mood: Mood) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="flex justify-center sm:justify-start flex-wrap gap-3">
      {Object.entries(MOOD_OPTIONS).map(([moodKey, moodInfo]) => {
        const mood = moodKey as Mood;
        const isSelected = selectedMood === mood;
        return (
          <button
            key={mood}
            type="button"
            onClick={() => onSelectMood(mood)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-lg border-2 w-20 h-20 transition-all duration-200
              ${isSelected
                ? 'border-primary-500 bg-primary-100 dark:bg-primary-900/50 scale-105 shadow-lg'
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }
            `}
          >
            <span className={`text-3xl ${isSelected ? '' : moodInfo.color}`}>{moodInfo.emoji}</span>
            <span className={`mt-1 text-xs font-medium ${isSelected ? 'text-primary-700 dark:text-primary-200' : 'text-gray-600 dark:text-gray-300'}`}>
              {moodInfo.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;

import React, { useState, useEffect, useCallback } from 'react';
import { ALL_AFFIRMATIONS } from '../../constants';
import { SparklesIcon } from '../icons/SparklesIcon';
import { RefreshCcwIcon } from '../icons/RefreshCcwIcon';
import { StarIcon } from '../icons/StarIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface Props {
  favorites: string[];
  isFavorite: (affirmation: string) => boolean;
  toggleFavorite: (affirmation: string) => void;
  className?: string;
}

const AffirmationsWidget: React.FC<Props> = ({ favorites, isFavorite, toggleFavorite, className }) => {
  const [affirmation, setAffirmation] = useState('');

  const getNewAffirmation = useCallback(() => {
    // Prefer a favorite if available
    if (favorites.length > 0 && Math.random() > 0.3) {
      return favorites[Math.floor(Math.random() * favorites.length)];
    }
    // Otherwise, get a random one, avoiding the current one if possible
    let newAffirmation = affirmation;
    if (ALL_AFFIRMATIONS.length > 1) {
        while (newAffirmation === affirmation) {
            newAffirmation = ALL_AFFIRMATIONS[Math.floor(Math.random() * ALL_AFFIRMATIONS.length)];
        }
    } else {
        newAffirmation = ALL_AFFIRMATIONS[0];
    }
    return newAffirmation;
  }, [favorites, affirmation]);

  useEffect(() => {
    setAffirmation(getNewAffirmation());
  }, [favorites]); // Rerun if favorites change

  const handleRefresh = () => {
    setAffirmation(getNewAffirmation());
  }

  return (
    <div className={`p-5 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md flex flex-col h-full ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-primary-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Daily Affirmation</h3>
        </div>
        <button onClick={handleRefresh} className="p-1 text-gray-400 hover:text-primary-500 transition-colors"><RefreshCcwIcon className="w-5 h-5"/></button>
      </div>
      <div className="flex-grow flex flex-col justify-center items-center text-center my-4" key={affirmation}>
          <p className="text-gray-700 dark:text-gray-200 text-lg font-medium animate-fade-in-up">
            "{affirmation}"
          </p>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700/50">
        <button
            onClick={() => toggleFavorite(affirmation)}
            className={`p-2 rounded-full transition-colors ${isFavorite(affirmation) ? 'text-yellow-400 bg-yellow-100/50 dark:bg-yellow-900/40' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            aria-label={isFavorite(affirmation) ? 'Remove from favorites' : 'Add to favorites'}
        >
            <StarIcon filled={isFavorite(affirmation)} className="w-5 h-5" />
        </button>
        <button onClick={() => window.location.hash = '#/affirmations'} className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            More <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AffirmationsWidget;
import React, { useState, useEffect, useCallback } from 'react';
import { ALL_AFFIRMATIONS } from '../constants';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { RefreshCcwIcon } from '../components/icons/RefreshCcwIcon';
import { StarIcon } from '../components/icons/StarIcon';
import { useFavorites } from '../hooks/useFavorites';

const AffirmationsPage: React.FC = () => {
    const [currentAffirmation, setCurrentAffirmation] = useState<string>('');
    const { toggleFavorite, isFavorite } = useFavorites();

    const loadNewAffirmation = useCallback(() => {
        let newAffirmation = currentAffirmation;
        // Ensure we don't get the same affirmation twice in a row, if possible
        if (ALL_AFFIRMATIONS.length > 1) {
            while (newAffirmation === currentAffirmation) {
                const randomIndex = Math.floor(Math.random() * ALL_AFFIRMATIONS.length);
                newAffirmation = ALL_AFFIRMATIONS[randomIndex];
            }
        } else {
             const randomIndex = Math.floor(Math.random() * ALL_AFFIRMATIONS.length);
             newAffirmation = ALL_AFFIRMATIONS[randomIndex];
        }
        setCurrentAffirmation(newAffirmation);
    }, [currentAffirmation]);

    useEffect(() => {
        // Load initial affirmation
        loadNewAffirmation();
    }, []);

    const handleFavoriteClick = () => {
        if (currentAffirmation) {
            toggleFavorite(currentAffirmation);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <header className="flex-shrink-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight flex items-center gap-3">
                    <SparklesIcon className="w-8 h-8 text-primary-500" />
                    Positive Affirmation
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
                    A powerful statement to uplift your spirit.
                </p>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center space-y-8 p-4">
                <div 
                    className="relative w-full max-w-2xl min-h-[250px] flex items-center justify-center p-8 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/50 dark:to-blue-900/50 rounded-2xl shadow-lg animate-fade-in-up"
                    key={currentAffirmation} // Re-trigger animation on change
                >
                     {currentAffirmation ? (
                        <p className="text-2xl sm:text-3xl font-medium text-center text-gray-800 dark:text-gray-100" aria-live="polite">
                            {currentAffirmation}
                        </p>
                    ) : (
                        <p className="text-lg text-gray-500 dark:text-gray-400">Loading affirmation...</p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={loadNewAffirmation}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
                        aria-label="Generate new affirmation"
                    >
                        <RefreshCcwIcon className="w-5 h-5" />
                        <span>New Affirmation</span>
                    </button>

                    <button
                        onClick={handleFavoriteClick}
                        className={`p-3 rounded-full transition-all duration-200 ease-in-out ${isFavorite(currentAffirmation) ? 'text-yellow-400 bg-yellow-100/50 dark:bg-yellow-900/40 transform scale-110' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        aria-label={isFavorite(currentAffirmation) ? 'Remove from favorites' : 'Add to favorites'}
                        disabled={!currentAffirmation}
                    >
                        <StarIcon filled={isFavorite(currentAffirmation)} className="w-6 h-6" />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AffirmationsPage;
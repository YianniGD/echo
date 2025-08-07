
import React, { useRef } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useStrengths } from '../hooks/useStrengths';
import { StarIcon } from '../components/icons/StarIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { DatabaseIcon } from '../components/icons/DatabaseIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { UploadIcon } from '../components/icons/UploadIcon';
import { AwardIcon } from '../components/icons/AwardIcon';
import { EXPORTABLE_KEYS, APP_INITIALIZED_KEY, STRENGTHS_KEY, COPING_MECHANISMS_KEY } from '../constants';

const FavoriteAffirmationCard: React.FC<{ text: string; onUnfavorite: () => void; }> = ({ text, onUnfavorite }) => {
    return (
        <div
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center justify-between gap-4"
        >
            <p className="flex-grow text-gray-700 dark:text-gray-200">
                {text}
            </p>
            <button
                onClick={onUnfavorite}
                className="p-2 rounded-full text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
                aria-label="Remove from favorites"
            >
                <StarIcon filled={true} className="w-6 h-6" />
            </button>
        </div>
    );
};

const ProfilePage: React.FC = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { strengths } = useStrengths();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataToExport: { [key: string]: any } = {};
    [...EXPORTABLE_KEYS, STRENGTHS_KEY, COPING_MECHANISMS_KEY].forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          dataToExport[key] = JSON.parse(value);
        } catch (e) {
          dataToExport[key] = value;
        }
      }
    });

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `echo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm("Are you sure you want to import this file? This will overwrite all current data in the app. This action cannot be undone.")) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("File could not be read.");
        }
        const data = JSON.parse(text);

        // Clear existing data first to prevent merging issues.
        [...EXPORTABLE_KEYS, STRENGTHS_KEY, COPING_MECHANISMS_KEY].forEach(key => localStorage.removeItem(key));
        
        // Import new data
        Object.keys(data).forEach(key => {
            localStorage.setItem(key, JSON.stringify(data[key]));
        });
        
        localStorage.setItem(APP_INITIALIZED_KEY, 'true');

        alert("Data imported successfully! The app will now reload.");
        window.location.reload();
      } catch (error) {
        alert("Error importing file. Please make sure it's a valid backup file.");
        console.error("Import error:", error);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="space-y-8">
      <header>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
              Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your personal space and settings.
          </p>
      </header>

       <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
          <AwardIcon className="w-7 h-7 text-primary-500" />
          My Strengths
        </h2>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
            {strengths.length > 0 ? (
            <div className="flex flex-wrap gap-3">
                {strengths.map((strength) => (
                    <div key={strength} className="px-3 py-1.5 bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200 rounded-full text-sm font-medium">
                        {strength}
                    </div>
                ))}
            </div>
            ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">You haven't selected any strengths yet.</p>
            )}
            <div className="text-right mt-4">
                <a href="#/resources" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                    Edit Strengths
                </a>
            </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
          <SparklesIcon className="w-7 h-7 text-primary-500" />
          Favorite Affirmations
        </h2>
        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((affirmation, index) => (
              <FavoriteAffirmationCard 
                key={index} 
                text={affirmation} 
                onUnfavorite={() => toggleFavorite(affirmation)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <p className="text-gray-600 dark:text-gray-400">You haven't favorited any affirmations yet.</p>
            <a href="#/affirmations" className="mt-4 inline-block text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Find some inspiration
            </a>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
          <DatabaseIcon className="w-7 h-7 text-primary-500" />
          Data Management
        </h2>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export all your data into a single file for backup or to transfer to another device. You can import this file later to restore your data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleExport} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <DownloadIcon className="w-5 h-5" />
                    Export All Data
                </button>
                <button onClick={handleImportClick} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <UploadIcon className="w-5 h-5" />
                    Import from Backup
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            </div>
        </div>
      </section>

    </div>
  );
};

export default ProfilePage;

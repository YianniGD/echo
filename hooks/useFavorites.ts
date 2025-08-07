import { useState, useCallback } from 'react';
import { FAVORITE_AFFIRMATIONS_KEY } from '../constants';

const getFavoritesFromStorage = (): string[] => {
    try {
        const storedFavorites = localStorage.getItem(FAVORITE_AFFIRMATIONS_KEY);
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
        console.error("Failed to load favorites from local storage:", error);
        return [];
    }
};

const saveFavoritesToStorage = (favorites: string[]) => {
    try {
        localStorage.setItem(FAVORITE_AFFIRMATIONS_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error("Failed to save favorites to local storage:", error);
    }
};


export const useFavorites = () => {
    const [favorites, setFavorites] = useState<string[]>(getFavoritesFromStorage);

    const isFavorite = useCallback((affirmation: string): boolean => {
        return favorites.includes(affirmation);
    }, [favorites]);
    
    const toggleFavorite = useCallback((affirmation: string) => {
        let updatedFavorites;
        if (isFavorite(affirmation)) {
            updatedFavorites = favorites.filter(fav => fav !== affirmation);
        } else {
            updatedFavorites = [...favorites, affirmation];
        }
        setFavorites(updatedFavorites);
        saveFavoritesToStorage(updatedFavorites);
    }, [favorites, isFavorite]);

    return { favorites, toggleFavorite, isFavorite };
};

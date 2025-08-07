import { useState, useEffect, useCallback } from 'react';
import { STRENGTHS_KEY } from '../constants';

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error(`Failed to load ${key} from storage:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T,>(key: string, data: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save ${key} to storage:`, error);
    }
};

export const useStrengths = () => {
    const [strengths, setStrengths] = useState<string[]>(() => getFromStorage(STRENGTHS_KEY, []));

    useEffect(() => {
        saveToStorage(STRENGTHS_KEY, strengths);
    }, [strengths]);
    
    const toggleStrength = useCallback((strength: string) => {
        setStrengths(prev => 
            prev.includes(strength)
            ? prev.filter(s => s !== strength)
            : [...prev, strength]
        );
    }, []);

    return { strengths, toggleStrength };
};

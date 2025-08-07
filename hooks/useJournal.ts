
import { useState, useEffect, useCallback } from 'react';
import { JournalEntry } from '../types';
import { JOURNAL_ENTRIES_KEY } from '../constants';

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

export const useJournal = () => {
    const [entries, setEntries] = useState<JournalEntry[]>(() => {
        const storedEntries = getFromStorage<JournalEntry[]>(JOURNAL_ENTRIES_KEY, []);
        // Sort entries on initial load for consistency
        return storedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    // Persist to localStorage whenever entries change.
    useEffect(() => {
        saveToStorage(JOURNAL_ENTRIES_KEY, entries);
    }, [entries]);

    const addEntry = useCallback((entryData: Omit<JournalEntry, 'id'>) => {
        const newEntry: JournalEntry = {
            ...entryData,
            id: crypto.randomUUID(),
        };
        setEntries(currentEntries =>
            [newEntry, ...currentEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
    }, []);

    const updateEntry = useCallback((updatedEntry: JournalEntry) => {
        setEntries(currentEntries =>
            currentEntries.map(e => (e.id === updatedEntry.id ? updatedEntry : e))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
    }, []);

    const deleteEntry = useCallback((id: string) => {
        setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    }, []);

    return { entries, addEntry, updateEntry, deleteEntry };
};


import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { JournalEntry } from '../types';
import { JOURNAL_ENTRIES_KEY } from '../constants';

// Helper functions for localStorage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        // Ensure entries are always sorted on load
        if (Array.isArray(stored)) {
             return stored.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as T;
        }
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error(`Failed to load ${key} from storage:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T,>(key:string, data: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save ${key} to storage:`, error);
    }
};


// Define the shape of the context data
interface JournalContextType {
    entries: JournalEntry[];
    addEntry: (entryData: Omit<JournalEntry, 'id'>) => void;
    updateEntry: (updatedEntry: JournalEntry) => void;
    deleteEntry: (id: string) => void;
}

// Create the context
export const JournalContext = createContext<JournalContextType | undefined>(undefined);

// Create the provider component
export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [entries, setEntries] = useState<JournalEntry[]>(() => getFromStorage(JOURNAL_ENTRIES_KEY, []));

    // Use useEffect for persistence, just like the working usePlanner hook.
    // This is the standard and most reliable way to handle side effects like this.
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
            currentEntries.map(e => e.id === updatedEntry.id ? updatedEntry : e)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
    }, []);

    const deleteEntry = useCallback((id: string) => {
        setEntries(currentEntries => currentEntries.filter(e => e.id !== id));
    }, []);
    
    // useMemo ensures the context value object is stable unless entries or actions change.
    const value = useMemo(() => ({
        entries,
        addEntry,
        updateEntry,
        deleteEntry
    }), [entries, addEntry, updateEntry, deleteEntry]);

    return (
        <JournalContext.Provider value={value}>
            {children}
        </JournalContext.Provider>
    );
};

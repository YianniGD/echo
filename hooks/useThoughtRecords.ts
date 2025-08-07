
import { useState, useEffect, useCallback } from 'react';
import { ThoughtRecord, ThoughtRecordData } from '../types';
import { THOUGHT_RECORDS_KEY } from '../constants';

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

export const useThoughtRecords = () => {
    const [records, setRecords] = useState<ThoughtRecord[]>(() => {
        const stored = getFromStorage<ThoughtRecord[]>(THOUGHT_RECORDS_KEY, []);
        return stored.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    useEffect(() => {
        saveToStorage(THOUGHT_RECORDS_KEY, records);
    }, [records]);

    const addRecord = useCallback((data: ThoughtRecordData) => {
        const newRecord: ThoughtRecord = {
            ...data,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
        };
        setRecords(prev => 
            [newRecord, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
        return newRecord;
    }, []);

    const deleteRecord = useCallback((id: string) => {
        setRecords(prev => prev.filter(r => r.id !== id));
    }, []);

    return { records, addRecord, deleteRecord };
};

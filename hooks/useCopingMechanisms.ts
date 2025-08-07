
import { useState, useEffect, useCallback } from 'react';
import { COPING_MECHANISMS_KEY } from '../constants';
import type { CopingMechanism } from '../types';

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

export const useCopingMechanisms = () => {
    const [mechanisms, setMechanisms] = useState<CopingMechanism[]>(() => getFromStorage(COPING_MECHANISMS_KEY, []));

    useEffect(() => {
        saveToStorage(COPING_MECHANISMS_KEY, mechanisms);
    }, [mechanisms]);

    const addMechanism = useCallback((mechanism: CopingMechanism) => {
        setMechanisms(prev => {
            if (prev.some(m => m.id === mechanism.id)) return prev;
            return [...prev, mechanism];
        });
    }, []);

    const removeMechanism = useCallback((id: string) => {
        setMechanisms(prev => prev.filter(m => m.id !== id));
    }, []);
    
    const isMechanismAdded = useCallback((id: string) => {
        return mechanisms.some(m => m.id === id);
    }, [mechanisms]);

    return { mechanisms, addMechanism, removeMechanism, isMechanismAdded };
};

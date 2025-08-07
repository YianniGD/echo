
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Medication, MedicationBundle, MedicationLog, MedicationTakenLog } from '../types';
import { MEDICATIONS_KEY, MEDICATION_BUNDLES_KEY, MEDICATION_LOGS_KEY } from '../constants';

// Helper to get data from localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error(`Failed to load ${key} from storage:`, error);
        return defaultValue;
    }
};

// Helper to save data to localStorage
const saveToStorage = <T>(key: string, data: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save ${key} to storage:`, error);
    }
};

export const useMedications = () => {
    const [medications, setMedications] = useState<Medication[]>(() => getFromStorage(MEDICATIONS_KEY, []));
    const [bundles, setBundles] = useState<MedicationBundle[]>(() => getFromStorage(MEDICATION_BUNDLES_KEY, []));
    const [logs, setLogs] = useState<MedicationLog[]>(() => getFromStorage(MEDICATION_LOGS_KEY, []));

    // Persist to localStorage whenever data changes
    useEffect(() => { saveToStorage(MEDICATIONS_KEY, medications); }, [medications]);
    useEffect(() => { saveToStorage(MEDICATION_BUNDLES_KEY, bundles); }, [bundles]);
    useEffect(() => { saveToStorage(MEDICATION_LOGS_KEY, logs); }, [logs]);

    // Medication CRUD
    const addMedication = (medData: Omit<Medication, 'id'>) => {
        const newMed: Medication = { ...medData, id: crypto.randomUUID() };
        setMedications(prev => [...prev, newMed]);
    };

    const updateMedication = (updatedMed: Medication) => {
        setMedications(prev => prev.map(m => m.id === updatedMed.id ? updatedMed : m));
    };

    const deleteMedication = (id: string) => {
        setMedications(prev => prev.filter(m => m.id !== id));
        // Also remove this medication from any bundles
        setBundles(prev => prev.map(b => ({
            ...b,
            medicationIds: b.medicationIds.filter(medId => medId !== id)
        })));
    };

    // Bundle CRUD
    const addBundle = (bundleData: Omit<MedicationBundle, 'id'>) => {
        const newBundle: MedicationBundle = { ...bundleData, id: crypto.randomUUID() };
        setBundles(prev => [...prev, newBundle]);
    };

    const updateBundle = (updatedBundle: MedicationBundle) => {
        setBundles(prev => prev.map(b => b.id === updatedBundle.id ? updatedBundle : b));
    };

    const deleteBundle = (id: string) => {
        setBundles(prev => prev.filter(b => b.id !== id));
    };

    // Logging
    const logTaken = (refId: string, type: 'medication' | 'bundle') => {
        const newLog: MedicationLog = { id: crypto.randomUUID(), timestamp: new Date().toISOString(), refId, type };
        setLogs(prev => [newLog, ...prev]);
    };

    // Derived state for easier consumption in components
    const unbundledMedications = useMemo(() => {
        const bundledMedIds = new Set(bundles.flatMap(b => b.medicationIds));
        return medications.filter(m => !bundledMedIds.has(m.id));
    }, [medications, bundles]);
    
    const todaysLogs = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return logs
            .filter(log => new Date(log.timestamp) >= today)
            .map((log): MedicationTakenLog | null => {
                if (log.type === 'medication') {
                    const med = medications.find(m => m.id === log.refId);
                    return med ? { id: log.id, refId: log.refId, name: med.name, timestamp: log.timestamp, type: 'medication' } : null;
                } else {
                    const bundle = bundles.find(b => b.id === log.refId);
                    return bundle ? { id: log.id, refId: log.refId, name: bundle.name, timestamp: log.timestamp, type: 'bundle' } : null;
                }
            })
            .filter((log): log is MedicationTakenLog => log !== null)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [logs, medications, bundles]);

    const isLoggedToday = useCallback((refId: string) => {
      return todaysLogs.some(log => log.refId === refId);
    }, [todaysLogs]);

    const clearTodaysLogs = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        setLogs(prev => prev.filter(log => new Date(log.timestamp) < today));
    }, []);

    return {
        medications,
        addMedication,
        updateMedication,
        deleteMedication,
        bundles,
        addBundle,
        updateBundle,
        deleteBundle,
        logTaken,
        todaysLogs,
        unbundledMedications,
        isLoggedToday,
        clearTodaysLogs,
    };
};
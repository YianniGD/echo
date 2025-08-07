

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PlannerTask } from '../types';
import { PLANNER_TASKS_KEY } from '../constants';
import { getTodayDateString } from '../utils/dateUtils';

const getTasksFromStorage = (): PlannerTask[] => {
    try {
        const stored = localStorage.getItem(PLANNER_TASKS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load tasks from storage:', error);
        return [];
    }
};

const saveTasksToStorage = (tasks: PlannerTask[]) => {
    try {
        localStorage.setItem(PLANNER_TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Failed to save tasks to storage:', error);
    }
};

export const usePlanner = () => {
    const [allTasks, setAllTasks] = useState<PlannerTask[]>(getTasksFromStorage);
    const today = getTodayDateString();

    useEffect(() => {
        saveTasksToStorage(allTasks);
    }, [allTasks]);

    const todaysTasks = useMemo(() => {
        return allTasks.filter(task => task.date === today).sort((a,b) => a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1);
    }, [allTasks, today]);

    const addTask = useCallback((text: string) => {
        if (!text.trim()) return;
        const newTask: PlannerTask = {
            id: crypto.randomUUID(),
            date: today,
            text: text.trim(),
            isCompleted: false,
        };
        setAllTasks(prev => [...prev, newTask]);
    }, [today]);

    const toggleTask = useCallback((id: string) => {
        setAllTasks(prev => 
            prev.map(task => 
                task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
            )
        );
    }, []);

    const updateTaskText = useCallback((id: string, newText: string) => {
        if (!newText.trim()) return;
        setAllTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, text: newText.trim() } : task
            )
        );
    }, []);
    
    const deleteTask = useCallback((id: string) => {
        setAllTasks(prev => prev.filter(task => task.id !== id));
    }, []);

    return {
        todaysTasks,
        addTask,
        toggleTask,
        updateTaskText,
        deleteTask,
    };
};
import React, { useState, useMemo } from 'react';
import { useJournal } from '../hooks/useJournal';
import { usePlanner } from '../hooks/usePlanner';
import { useThoughtRecords } from '../hooks/useThoughtRecords';
import { formatDate } from '../utils/dateUtils';
import { JOURNAL_NAV_KEY, THOUGHT_RECORD_NAV_KEY } from '../constants';
import { JournalEntry, PlannerTask, ThoughtRecord } from '../types';

import MonthView from '../components/calendar/MonthView';
import WeekView from '../components/calendar/WeekView';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';

type CalendarView = 'month' | 'week';

const CalendarPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('month');

    const { entries } = useJournal();
    const { todaysTasks: allTasks } = usePlanner(); // Note: usePlanner is scoped to today, we need all tasks for a calendar.
    const { records: thoughtRecords } = useThoughtRecords();
    
    const allPlannerTasks = useMemo(() => {
        try {
            const stored = localStorage.getItem('echo_planner_tasks');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }, [allTasks]);

    const eventsByDate = useMemo(() => {
        const events: { [key: string]: { entries: JournalEntry[], tasks: PlannerTask[], thoughts: ThoughtRecord[] } } = {};

        const addEvent = (dateStr: string, type: 'entries' | 'tasks' | 'thoughts', data: any) => {
            if (!events[dateStr]) events[dateStr] = { entries: [], tasks: [], thoughts: [] };
            events[dateStr][type].push(data);
        };

        entries.forEach(entry => addEvent(formatDate(new Date(entry.date)), 'entries', entry));
        allPlannerTasks.forEach(task => addEvent(task.date, 'tasks', task));
        thoughtRecords.forEach(record => addEvent(formatDate(new Date(record.date)), 'thoughts', record));

        return events;
    }, [entries, allPlannerTasks, thoughtRecords]);

    const handlePrev = () => {
        if (view === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
        }
    };

    const handleNext = () => {
        if (view === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
        }
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleDayClick = (date: Date) => {
        const dateStr = formatDate(date);
        const entryForDay = entries.find(e => formatDate(new Date(e.date)) === dateStr);
        const thoughtRecordForDay = thoughtRecords.find(t => formatDate(new Date(t.date)) === dateStr);

        if (entryForDay) {
            const navData = { date: date.toISOString(), entryId: entryForDay.id };
            localStorage.setItem(JOURNAL_NAV_KEY, JSON.stringify(navData));
            window.location.hash = '#/journal';
        } else if (thoughtRecordForDay) {
            const navData = { recordId: thoughtRecordForDay.id };
            localStorage.setItem(THOUGHT_RECORD_NAV_KEY, JSON.stringify(navData));
            window.location.hash = '#/thoughts';
        } else {
            const navData = { date: date.toISOString(), entryId: null };
            localStorage.setItem(JOURNAL_NAV_KEY, JSON.stringify(navData));
            window.location.hash = '#/journal';
        }
    };


    const headerText = useMemo(() => {
        if (view === 'month') {
            return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } else {
            const start = new Date(currentDate);
            const dayOfWeek = start.getDay();
            start.setDate(start.getDate() - dayOfWeek);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            
            if (start.getMonth() === end.getMonth()) {
                 return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getFullYear()}`;
            }
            return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        }
    }, [currentDate, view]);

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                     <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                        {headerText}
                    </h1>
                     <div className="flex items-center gap-1">
                        <button onClick={handlePrev} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Previous period"><ChevronLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button>
                        <button onClick={handleNext} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Next period"><ChevronRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handleToday} className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">
                        Today
                    </button>
                    <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-0.5">
                        <button onClick={() => setView('month')} className={`px-3 py-1 text-sm rounded-md ${view === 'month' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Month</button>
                        <button onClick={() => setView('week')} className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Week</button>
                    </div>
                </div>
            </header>

            <main>
                {view === 'month' ? (
                    <MonthView 
                        currentDate={currentDate} 
                        eventsByDate={eventsByDate}
                        onDayClick={handleDayClick}
                     />
                ) : (
                    <WeekView 
                        currentDate={currentDate} 
                        eventsByDate={eventsByDate} 
                        onDayClick={handleDayClick}
                    />
                )}
            </main>
        </div>
    );
};

export default CalendarPage;
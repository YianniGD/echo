import React, { useState, useMemo } from 'react';
import { usePlanner } from '../hooks/usePlanner';
import PlannerTaskItem from '../components/planner/PlannerTaskItem';
import { ClipboardListIcon } from '../components/icons/ClipboardListIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';

const DailyPlannerPage: React.FC = () => {
    const { todaysTasks, addTask, toggleTask, updateTaskText, deleteTask } = usePlanner();
    const [newTaskText, setNewTaskText] = useState('');

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        addTask(newTaskText);
        setNewTaskText('');
    };

    const completedCount = useMemo(() => todaysTasks.filter(t => t.isCompleted).length, [todaysTasks]);
    const totalCount = todaysTasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    const todayFormatted = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="space-y-8">
            <header>
                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight flex items-center gap-3">
                    <ClipboardListIcon className="w-8 h-8 text-primary-500" />
                    Daily Planner
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{todayFormatted}</p>
            </header>
            
            <section>
                <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="Add a new task for today..."
                        className="flex-grow w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
                        aria-label="New task input"
                    />
                    <button
                        type="submit"
                        disabled={!newTaskText.trim()}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        aria-label="Add new task"
                    >
                        <PlusCircleIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Add</span>
                    </button>
                </form>
            </section>

            <main>
                {totalCount > 0 ? (
                    <>
                        <div className="mb-4">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{completedCount} of {totalCount} completed</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {todaysTasks.map(task => (
                                <PlannerTaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={toggleTask}
                                    onUpdate={updateTaskText}
                                    onDelete={deleteTask}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <ClipboardListIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                        <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">All Clear for Today!</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Add a task above to get your day planned.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DailyPlannerPage;

import React, { useState, useMemo } from 'react';
import { PlannerTask } from '../../types';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface Props {
  tasks: PlannerTask[];
  onAddTask: (text: string) => void;
  className?: string;
}

const PlannerWidget: React.FC<Props> = ({ tasks, onAddTask, className }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const completedCount = useMemo(() => tasks.filter(t => t.isCompleted).length, [tasks]);
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const incompleteTasks = useMemo(() => tasks.filter(t => !t.isCompleted).slice(0, 3), [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText);
      setNewTaskText('');
    }
  };

  return (
    <div className={`p-5 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md flex flex-col h-full ${className}`}>
      <div className="flex items-center gap-3">
        <ClipboardListIcon className="w-6 h-6 text-primary-500" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Today's Planner</h3>
      </div>
      
      <div className="my-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{completedCount} of {totalCount}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex-grow space-y-2">
        {incompleteTasks.length > 0 ? (
          incompleteTasks.map(task => (
            <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-5 h-5 flex-shrink-0 rounded-full border-2 border-gray-400 dark:border-gray-500"></div>
                <p className="text-sm text-gray-700 dark:text-gray-200 truncate">{task.text}</p>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{totalCount > 0 ? "All tasks complete!" : "No tasks for today."}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleAddTask} className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Quick add..."
          className="flex-grow w-full px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
        />
        <button type="submit" disabled={!newTaskText.trim()} className="flex-shrink-0 p-2 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 disabled:bg-gray-400">
          <PlusCircleIcon className="w-5 h-5" />
        </button>
      </form>
      <div className="flex justify-end pt-2">
         <button onClick={() => window.location.hash = '#/planner'} className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline">
            View All Tasks <ArrowRightIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default PlannerWidget;

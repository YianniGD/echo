
import React, { useState, useRef, useEffect } from 'react';
import { PlannerTask } from '../../types';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

interface PlannerTaskItemProps {
    task: PlannerTask;
    onToggle: (id: string) => void;
    onUpdate: (id: string, text: string) => void;
    onDelete: (id: string) => void;
}

const PlannerTaskItem: React.FC<PlannerTaskItemProps> = ({ task, onToggle, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleUpdate = () => {
        if (editText.trim() && editText.trim() !== task.text) {
            onUpdate(task.id, editText);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleUpdate();
        } else if (e.key === 'Escape') {
            setEditText(task.text);
            setIsEditing(false);
        }
    };
    
    return (
        <div className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 shadow-sm animate-fade-in-up ${task.isCompleted ? 'bg-green-50 dark:bg-green-900/20 opacity-70' : 'bg-white dark:bg-gray-800'}`}>
            <button onClick={() => onToggle(task.id)} className="flex-shrink-0" aria-label={task.isCompleted ? "Mark task as incomplete" : "Mark task as complete"}>
                {task.isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-500 group-hover:border-primary-500 transition-colors"></div>
                )}
            </button>

            <div className="flex-grow">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleUpdate}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent p-1 -m-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-100"
                    />
                ) : (
                    <p className={`text-gray-800 dark:text-gray-100 ${task.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                        {task.text}
                    </p>
                )}
            </div>

            <div className="flex-shrink-0 flex items-center gap-1">
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Edit task"
                    disabled={task.isCompleted}
                >
                    <EditIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    aria-label="Delete task"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default PlannerTaskItem;

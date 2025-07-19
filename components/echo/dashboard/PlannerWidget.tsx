'use client';
import React, { useState, useEffect } from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { PlannerTask } from '@/lib/types';
import { View } from '@/lib/types';
import { CheckSquare, List, Target } from 'lucide-react';

interface PlannerWidgetProps {
  todaysGoals: PlannerTask[]; 
  selectedDate: Date;
  onNavigate: (view: View) => void;
  totalGoalsToday: number;
  completedGoalsToday: number;
}

const PlannerWidget: React.FC<PlannerWidgetProps> = ({
  todaysGoals,
  selectedDate,
  onNavigate,
  totalGoalsToday,
  completedGoalsToday,
}) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(selectedDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
    }));
  }, [selectedDate]);


  return (
    <div className="bg-surface-container-low p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Target className="w-7 h-7 text-secondary" />
            <h3 className="font-serif text-headline-sm text-surface-on">
              Today's Goals
            </h3>
          </div>
           {totalGoalsToday > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full">
              {completedGoalsToday}/{totalGoalsToday} done
            </span>
          )}
        </div>
        <p className="text-label-lg text-surface-on-variant mb-3 min-h-[1.25rem]">{formattedDate}</p>

        {todaysGoals.length > 0 ? (
          <ul className="space-y-2 mb-4 max-h-32 overflow-y-auto">
            {todaysGoals.map(goal => (
              <li key={goal.id} className="flex items-center p-2 bg-surface rounded-md">
                <CheckSquare className={`w-4 h-4 mr-2 flex-shrink-0 ${goal.completed ? 'text-secondary' : 'text-outline-variant'}`} />
                <span className={`text-body-sm text-surface-on truncate ${goal.completed ? 'line-through text-surface-on-variant' : ''}`} title={goal.text}>
                  {goal.text}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-md text-surface-on-variant mb-4">
            No specific goals set for today. Plan your day!
          </p>
        )}
      </div>
      <ActionButton
        variant="tonal"
        size="md"
        leadingIcon={<List />}
        onClick={() => onNavigate('planner')}
        aria-label="Open Goal Tracker page"
        className="w-full mt-auto"
      >
        View Today's Focus
      </ActionButton>
    </div>
  );
};

export default PlannerWidget;

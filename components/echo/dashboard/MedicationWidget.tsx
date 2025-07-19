'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { MinusCircle, Package, Settings } from 'lucide-react';
import { View } from '@/lib/types';

interface MedicationWidgetProps {
  medicationsCount: number;
  medicationGroupsCount: number;
  onNavigate: (view: View) => void;
}

const MedicationWidget: React.FC<MedicationWidgetProps> = ({
  medicationsCount,
  medicationGroupsCount,
  onNavigate,
}) => {
  return (
    <div className="bg-surface-container-low p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
                <MinusCircle className="w-7 h-7 text-error transform rotate-90" />
                <h3 className="font-serif text-headline-sm text-surface-on">
                    Medication
                </h3>
            </div>
        </div>
        <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center p-2.5 bg-surface rounded-lg">
                <p className="text-body-md text-surface-on">Tracked Medications:</p>
                <span className="font-semibold text-primary">{medicationsCount}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-surface rounded-lg">
                <p className="text-body-md text-surface-on">Medication Bundles:</p>
                <span className="font-semibold text-secondary">{medicationGroupsCount}</span>
            </div>
        </div>
         {medicationsCount === 0 && (
          <p className="text-body-md text-surface-on-variant mb-4">
            Add your medications to start tracking.
          </p>
        )}
      </div>
      <ActionButton
        variant="filled"
        style={{backgroundColor: 'var(--error-container)', color: 'var(--on-error-container)'}}
        size="md"
        leadingIcon={<Settings />}
        onClick={() => onNavigate('medication')}
        aria-label="Manage medications and view log"
        className="w-full mt-auto"
      >
        Manage Medications
      </ActionButton>
    </div>
  );
};

export default MedicationWidget;

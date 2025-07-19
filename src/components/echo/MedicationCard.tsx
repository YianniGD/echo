'use client';
import React from 'react';
import { Medication } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import { Edit2, Trash2, CheckCircle } from 'lucide-react';

interface MedicationCardProps {
  medication: Medication;
  onLogTaken: (medication: Medication) => void;
  onEdit: (medication: Medication) => void;
  onDelete: (id: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onLogTaken, onEdit, onDelete }) => {
  return (
    <div className="bg-surface-container-low shadow-lg rounded-xl p-5 sm:p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-serif text-title-lg text-surface-on">{medication.name}</h3>
          <p className="text-body-md text-surface-on-variant">
            {medication.dosage} - {medication.frequency}
          </p>
        </div>
        <div className="flex space-x-1">
          <ActionButton
            variant="text"
            size="sm"
            isIconOnly
            title="Edit Medication"
            onClick={() => onEdit(medication)}
            aria-label={`Edit ${medication.name}`}
          >
            <Edit2 className="w-5 h-5" />
          </ActionButton>
          <ActionButton
            variant="text"
            size="sm"
            isIconOnly
            title="Delete Medication"
            onClick={() => {
              onDelete(medication.id);
            }}
            aria-label={`Delete ${medication.name}`}
            className="text-error hover:bg-error-container/20"
          >
            <Trash2 className="w-5 h-5" />
          </ActionButton>
        </div>
      </div>

      {medication.notes && (
        <p className="text-body-sm text-surface-on-variant italic bg-surface-container p-2 rounded-md mb-3">
          Notes: {medication.notes}
        </p>
      )}

      <ActionButton
        variant="tonal"
        size="md"
        leadingIcon={<CheckCircle className="w-5 h-5" />}
        onClick={() => onLogTaken(medication)}
        className="w-full"
        aria-label={`Log ${medication.name} as taken`}
      >
        Log Taken Now
      </ActionButton>
    </div>
  );
};

export default MedicationCard;
